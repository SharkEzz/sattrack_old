package dto

import (
	"time"

	"github.com/SharkEzz/sgp4"
)

type TrackingRequest struct {
	CatNBR int     `validate:"required"`
	Lat    float64 `validate:"required,latitude"`
	Lng    float64 `validate:"required,longitude"`
	Alt    float64 `validate:"required"`
}

type TrackingResponse struct {
	sgp4.Observation
	GeneratedAt time.Time
}

type ObservationWsResponse struct {
	SatName     string
	Visible     bool
	GeneratedAt time.Time
	sgp4.Observation
}
