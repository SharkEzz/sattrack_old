package handlers

import (
	"net/http"

	"github.com/SharkEzz/sattrack/dto"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func HandlePostPasses(c *fiber.Ctx, db *gorm.DB, validator *validator.Validate) error {
	requestData := dto.PassesRequest{}
	c.BodyParser(&requestData)
	err := validator.Struct(requestData)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(dto.Response{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(requestData)
}
