package handlers

import (
	"net/http"
	"time"

	"github.com/SharkEzz/sattrack/dto"
	"github.com/SharkEzz/sattrack/services"
	"github.com/SharkEzz/sgp4"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func HandleGetPasses(c *fiber.Ctx, db *gorm.DB, validator *validator.Validate) error {
	requestData := dto.PassesRequest{}
	c.BodyParser(&requestData)
	err := validator.Struct(requestData)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(dto.Response{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}
	if requestData.StopTime.Before(time.Now()) {
		return c.Status(http.StatusBadRequest).JSON(dto.Response{
			Status:  http.StatusBadRequest,
			Message: "StopTime can't be before current time",
		})
	}
	if requestData.StopTime.After(time.Now().Add(time.Second * 864000)) { // 10 days
		return c.Status(http.StatusBadRequest).JSON(dto.Response{
			Status:  http.StatusBadRequest,
			Message: "Can't computes passes more than 10 days in the future",
		})
	}

	tle, err := services.GetTLEFromDatabase(requestData.CatNBR, db)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(dto.Response{
			Status:  http.StatusNotFound,
			Message: "TLE not found",
		})
	}

	sgp4, err := sgp4.NewSGP4(tle)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(dto.Response{
			Status:  http.StatusInternalServerError,
			Message: err.Error(),
		})
	}

	passes := sgp4.GeneratePasses(
		requestData.Lat,
		requestData.Lng,
		requestData.Alt,
		time.Now().UTC(),
		requestData.StopTime.UTC(),
		360,
	)

	return c.JSON(passes)
}
