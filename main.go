package main

import (
	"flag"

	"github.com/SharkEzz/sattrack/database"
	"github.com/SharkEzz/sattrack/handlers"
	"github.com/SharkEzz/sattrack/services"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var (
	shouldUpdate = flag.Bool("update", false, "Use this flag to update all the TLE")
)

func main() {
	flag.Parse()
	db := database.Init("database/local.db")

	validator := validator.New()

	if *shouldUpdate {
		services.UpdateDatabase(db)
	}

	app := fiber.New()

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Post("/tracking", func(c *fiber.Ctx) error {
		return handlers.HandlePostTracking(c, db, validator)
	})

	app.Get("/ws/tracking", websocket.New(func(c *websocket.Conn) {
		handlers.HandleWsTracking(c, db)
	}))

	app.Listen(":8000")
}
