package main

import (
	"flag"

	"github.com/SharkEzz/sattrack/database"
	"github.com/SharkEzz/sattrack/database/models"
	"github.com/SharkEzz/sattrack/handlers"
	"github.com/SharkEzz/sattrack/services"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var (
	shouldUpdate = flag.Bool("update", false, "Use this flag to update all the TLE")
)

func main() {
	flag.Parse()
	db := database.Init("database/local.db")
	db.AutoMigrate(&models.TLE{})

	validator := validator.New()

	if *shouldUpdate {
		services.UpdateDatabase(db)
	}

	app := fiber.New()

	app.Post("/tracking", func(c *fiber.Ctx) error {
		return handlers.HandlePostTracking(c, db, validator)
	})

	app.Listen(":8000")
}
