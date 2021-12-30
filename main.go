package main

import (
	"flag"
	"log"

	"github.com/SharkEzz/sattrack/database"
	"github.com/SharkEzz/sattrack/handlers"
	"github.com/SharkEzz/sattrack/services"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

const (
	AppName = "SatTrack"
)

var (
	shouldUpdate = flag.Bool("update", false, "Use this flag to update all the TLE")
	Version      = "no_version"
)

func main() {
	flag.Parse()

	db := database.Init("database/local.db")

	validator := validator.New()

	if *shouldUpdate {
		services.UpdateDatabase(db)
	}

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString(AppName)
	})

	app.Post("/tracking", func(c *fiber.Ctx) error {
		return handlers.HandlePostTracking(c, db, validator)
	})

	app.Get("/ws/tracking", websocket.New(func(c *websocket.Conn) {
		handlers.HandleWsTracking(c, db)
	}))

	log.Println("Started", AppName, Version)
	app.Listen(":8000")
}
