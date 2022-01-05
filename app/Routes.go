package app

import (
	"github.com/SharkEzz/sattrack/handlers"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"gorm.io/gorm"
)

func InitRoutes(app *fiber.App, db *gorm.DB, validator *validator.Validate) {

	// Middlewares

	InitMiddlewares(app)

	// API

	apiGroup := app.Group("/api")
	apiGroup.Post("/tracking", func(c *fiber.Ctx) error {
		return handlers.HandlePostTracking(c, db, validator)
	})
	apiGroup.Get("/passes", func(c *fiber.Ctx) error {
		return handlers.HandlePostPasses(c, db)
	})

	// WebSocket

	app.Get("/ws/tracking", websocket.New(func(c *websocket.Conn) {
		handlers.HandleWsTracking(c, db)
	}))

	// Frontend

	app.Static("/", "public")
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("public/index.html")
	})
}
