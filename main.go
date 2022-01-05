package main

import (
	"flag"

	"github.com/SharkEzz/sattrack/app"
)

const (
	appName string = "SatTrack"
)

var (
	shouldUpdate = flag.Bool("update", false, "Use this flag to update all the TLE")
	tleListURL   = flag.String("tleUrl", "https://celestrak.com/NORAD/elements/active.txt", "default URL to fetch TLEs")
	version      = "devel"
)

func main() {
	flag.Parse()

	app.Run(
		"./data/local.db",
		appName,
		version,
		*tleListURL,
		*shouldUpdate,
	)
}
