package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/SharkEzz/sattrack/dto"
	"github.com/SharkEzz/sattrack/services"
	"github.com/SharkEzz/sgp4"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"gorm.io/gorm"
)

func HandlePostTracking(c *fiber.Ctx, db *gorm.DB, validator *validator.Validate) error {
	requestData := &dto.TrackingRequest{}
	c.BodyParser(requestData)
	err := validator.Struct(requestData)
	if err != nil {
		c.Response().SetStatusCode(http.StatusBadRequest)
		return c.JSON(dto.Error{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	tle, err := services.GetTLEFromDatabase(requestData.CatNBR, db)
	if err != nil {
		c.Response().SetStatusCode(http.StatusNotFound)
		return c.JSON(dto.Error{
			Status:  http.StatusNotFound,
			Message: "Satellite not found",
		})
	}

	sgp4, err := sgp4.NewSGP4(tle)
	if err != nil {
		c.Response().SetStatusCode(http.StatusInternalServerError)
		return c.JSON(dto.Error{
			Status:  http.StatusInternalServerError,
			Message: "Error while initializing SGP4, please try again later",
		})
	}

	observation := sgp4.ObservationFromLocation(requestData.Lat, requestData.Lng, requestData.Alt)

	return c.JSON(dto.TrackingResponse{
		Observation: observation,
		GeneratedAt: time.Now(),
	})
}

func HandleWsTracking(c *websocket.Conn, db *gorm.DB) {
	defer c.Close()
	var (
		qCatNbr = c.Query("catNbr")
		qLat    = c.Query("lat")
		qLng    = c.Query("lng")
		qAlt    = c.Query("alt")
	)
	catNbr, err := strconv.ParseInt(qCatNbr, 10, 64)
	if err != nil {
		handleError(c, "Invalid CatNbr")
		return
	}
	lat, err := strconv.ParseFloat(qLat, 64)
	if err != nil {
		handleError(c, "Invalid Latitude")
		return
	}
	lng, err := strconv.ParseFloat(qLng, 64)
	if err != nil {
		handleError(c, "Invalid Longitude")
		return
	}
	alt, err := strconv.ParseFloat(qAlt, 64)
	if err != nil {
		handleError(c, "Invalid Altitude")
		return
	}

	tle, err := services.GetTLEFromDatabase(int(catNbr), db)
	if err != nil {
		handleError(c, "TLE not found")
		return
	}

	sgp4, err := sgp4.NewSGP4(tle)
	if err != nil {
		handleError(c, "Error while initializing SGP4, try again later")
		return
	}

	for {
		observation := sgp4.ObservationFromLocation(lat, lng, alt)
		if err := c.WriteJSON(observation); err != nil {
			// error
			break
		}
		time.Sleep(time.Millisecond * 500)
	}
}

func handleError(c *websocket.Conn, errStr string) {
	c.WriteMessage(1, []byte(errStr))
	c.Close()
}
