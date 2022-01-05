package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func HandlePostPasses(c *fiber.Ctx, db *gorm.DB) error {
	return c.SendString("passes")
}
