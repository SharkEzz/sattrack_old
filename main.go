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
	appName string = "SatTrack"
)

var (
	shouldUpdate = flag.Bool("update", false, "Use this flag to update all the TLE")
	tleListURL   = flag.String("tleUrl", "https://celestrak.com/NORAD/elements/active.txt", "default URL to fetch TLEs")
	version      = "devel"
)

func main() {
	flag.Parse()

	db := database.Init("database/local.db")

	if *shouldUpdate {
		services.UpdateDatabase(*tleListURL, db)
	}

	validator := validator.New()

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
		AppName:               appName,
	})

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString(appName + "🛰️")
	})

	app.Post("/tracking", func(c *fiber.Ctx) error {
		return handlers.HandlePostTracking(c, db, validator)
	})

	app.Get("/ws/tracking", websocket.New(func(c *websocket.Conn) {
		handlers.HandleWsTracking(c, db)
	}))

	log.Println("Started", appName, version)
	app.Listen(":8000")
}
