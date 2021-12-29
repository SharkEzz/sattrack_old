package services

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/SharkEzz/sattrack/database/models"
	"github.com/SharkEzz/sgp4"
	"gorm.io/gorm"
)

// CelesTrack active satellites list
const activeListUrl string = "https://celestrak.com/NORAD/elements/active.txt"

// Fetch all active satellite from CelesTrack and update the satellites table
func UpdateDatabase(db *gorm.DB) error {
	fmt.Println("Updating TLE database")
	fmt.Println("Deleting record from `tles` table")
	db.Exec("DELETE FROM tles")
	fmt.Println("Querying new TLE list")
	res, err := http.Get(activeListUrl)
	if err != nil {
		return err
	}

	content, _ := io.ReadAll(res.Body)
	contentStr := strings.TrimSpace(string(content))
	contentArr := strings.Split(string(contentStr), "\n")

	if len(contentArr)%3 != 0 {
		return errors.New("invalid TLE count")
	}

	fmt.Println("Inserting new records")
	start := time.Now()
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

	fmt.Printf("Inserted %v TLE in %s\n", len(contentArr)/3, time.Since(start))

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
