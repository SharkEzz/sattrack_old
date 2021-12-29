package database

import (
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

	return db
}
