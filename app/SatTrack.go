package app

import (
	"log"

	"github.com/SharkEzz/sattrack/database"
	"github.com/SharkEzz/sattrack/services"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func Run(dbPath, appName, version, tleURL string, update bool) {
	log.Println("Starting", appName, version)

	db := database.Init("./data/local.db")

	if update {
		services.UpdateDatabase(tleURL, db)
	} else {
		log.Println("Not updating TLE database (flag -update not given)")
	}

	log.Println("Loaded", services.GetTLECount(db), "TLEs")

	validator := validator.New()

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
		AppName:               appName,
	})

	InitRoutes(app, db, validator)

	log.Println(appName, "ready")
	app.Listen(":8000")
}
