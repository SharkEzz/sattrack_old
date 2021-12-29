package models

import "gorm.io/gorm"

type TLE struct {
	gorm.Model
	CatNBR int
	Name   string
	Line1  string
	Line2  string
}
