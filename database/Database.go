package database

import (
	"log"

	"github.com/SharkEzz/sattrack/database/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Init(path string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{
		CreateBatchSize: 400,
	})
	if err != nil {
		panic("failed to connect to the database")
	}

	db.AutoMigrate(&models.TLE{})

	log.Println("Database initialized")

	return db
}
