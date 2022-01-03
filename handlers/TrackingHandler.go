package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/SharkEzz/sattrack/dto"
	"github.com/SharkEzz/sattrack/services"
	"github.com/SharkEzz/sattrack/validation"
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
		return c.JSON(dto.Response{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	tle, err := services.GetTLEFromDatabase(requestData.CatNBR, db)
	if err != nil {
		c.Response().SetStatusCode(http.StatusNotFound)
		return c.JSON(dto.Response{
			Status:  http.StatusNotFound,
			Message: "Satellite not found",
		})
	}

	sgp4, err := sgp4.NewSGP4(tle)
	if err != nil {
		c.Response().SetStatusCode(http.StatusInternalServerError)
		return c.JSON(dto.Response{
			Status:  http.StatusInternalServerError,
			Message: "Error while initializing SGP4, please try again later",
		})
	}

	observation := sgp4.ObservationFromLocation(requestData.Lat, requestData.Lng, requestData.Alt)

	trackingResponse := dto.TrackingResponse{
		Observation: observation,
		GeneratedAt: time.Now(),
	}

	response := dto.Response{
		Status:  http.StatusOK,
		Message: "",
		Data:    trackingResponse,
	}

	return c.JSON(response)
}

func HandleWsTracking(c *websocket.Conn, db *gorm.DB) {
	defer c.Close()
	catNbr, lat, lng, alt, err := validation.ValidateWebsocketQuery(c)

	if err != nil {
		handleError(c, http.StatusBadRequest, err.Error())
		return
	}

	tle, err := services.GetTLEFromDatabase(catNbr, db)
	if err != nil {
		handleError(c, http.StatusNotFound, "TLE not found")
		return
	}

	sgp4, err := sgp4.NewSGP4(tle)
	if err != nil {
		handleError(c, http.StatusInternalServerError, "Error while initializing SGP4, try again later")
		return
	}

	for {
		observation := sgp4.ObservationFromLocation(lat, lng, alt)
		observationResponseDto := dto.ObservationWsResponse{
			SatName:     strings.TrimSpace(tle.Name()),
			Visible:     observation.Elevation > 0,
			GeneratedAt: time.Now().UTC(),
			Observation: observation,
		}
		response := dto.Response{
			Status: http.StatusOK,
			Data:   observationResponseDto,
		}
		if err := c.WriteJSON(response); err != nil {
			return
		}
		if _, _, err := c.ReadMessage(); err != nil {
			return
		}
		time.Sleep(time.Second)
	}
}

func handleError(c *websocket.Conn, status int, message string) {
	c.WriteJSON(dto.Response{
		Status:  status,
		Message: message,
	})
}
