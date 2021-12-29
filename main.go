package main

import (
	"github.com/SharkEzz/sattrack/database"
	"github.com/SharkEzz/sattrack/database/models"
	"github.com/gofiber/fiber/v2"
)

func main() {
	db := database.Init("database/local.db")
	db.AutoMigrate(&models.TLE{})

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("oui")
	})

	app.Listen(":8000")
}
