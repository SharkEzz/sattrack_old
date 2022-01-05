package dto

import "time"

type PassesRequest struct {
	CatNBR    int       `validate:"required"`
	Lat       float64   `validate:"required,latitude"`
	Lng       float64   `validate:"required,longitude"`
	Alt       float64   `validate:"required"`
	StartTime time.Time `validate:"required"`
	StopTime  time.Time `validate:"required"`
}
