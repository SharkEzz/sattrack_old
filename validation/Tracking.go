package validation

import (
	"errors"
	"strconv"

	"github.com/gofiber/websocket/v2"
)

func ValidateWebsocketQuery(c *websocket.Conn) (int, float64, float64, float64, error) {
	var (
		qCatNbr = c.Query("catNbr")
		qLat    = c.Query("lat")
		qLng    = c.Query("lng")
		qAlt    = c.Query("alt")
	)

	catNbr, err := strconv.ParseInt(qCatNbr, 10, 64)
	if err != nil {
		return 0, 0, 0, 0, errors.New("invalid catnbr")
	}
	lat, err := strconv.ParseFloat(qLat, 64)
	if err != nil {
		return 0, 0, 0, 0, errors.New("invalid latitude")
	}
	lng, err := strconv.ParseFloat(qLng, 64)
	if err != nil {
		return 0, 0, 0, 0, errors.New("invalid longitude")
	}
	alt, err := strconv.ParseFloat(qAlt, 64)
	if err != nil {
		return 0, 0, 0, 0, errors.New("invalid altitude")
	}

	return int(catNbr), lat, lng, alt, nil
}
