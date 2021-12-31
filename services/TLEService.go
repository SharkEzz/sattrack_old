package services

import (
	"errors"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/SharkEzz/sattrack/database/models"
	"github.com/SharkEzz/sgp4"
	"gorm.io/gorm"
)

// Fetch all active satellite a defined URL and update the tles table
func UpdateDatabase(url string, db *gorm.DB) error {
	start := time.Now()
	log.Println("Starting TLE updater")
	db.Exec("DELETE FROM tles")
	log.Println("Querying new TLE list")
	res, err := http.Get(url)
	if err != nil {
		return err
	}

	content, _ := io.ReadAll(res.Body)
	contentStr := strings.TrimSpace(string(content))
	contentArr := strings.Split(string(contentStr), "\n")

	if len(contentArr)%3 != 0 {
		return errors.New("invalid TLE count")
	}

	satellites := []models.TLE{}
	for i := 0; i < len(contentArr); i += 3 {
		tle, err := sgp4.NewTLE(contentArr[i][:24], contentArr[i+1][:69], contentArr[i+2][:69])
		if err != nil {
			// TODO: error handling
			continue
		}
		satellites = append(satellites, models.TLE{
			Name:   tle.Name(),
			CatNBR: tle.NoradNumber(),
			Line1:  tle.Line1(),
			Line2:  tle.Line2(),
		})
	}
	db.Create(&satellites)

	log.Default().Printf("Updated %v TLE in %s\n", len(contentArr)/3, time.Since(start).Round(time.Millisecond))

	return nil
}

// Get a TLE from the database by it's NORAD catalog number
func GetTLEFromDatabase(catNbr int, db *gorm.DB) (*sgp4.TLE, error) {
	dbTLE := new(models.TLE)
	db.Where("cat_nbr = ?", catNbr).First(&dbTLE)

	if dbTLE == nil {
		return nil, errors.New("satellite not found")
	}

	tle, err := sgp4.NewTLE(dbTLE.Name, dbTLE.Line1, dbTLE.Line2)
	if err != nil {
		return nil, err
	}

	return tle, nil
}

func GetTLECount(db *gorm.DB) int64 {
	var count int64

	db.Model(&models.TLE{}).Count(&count)

	return count
}
