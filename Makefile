ifndef VERSION
VERSION := $(shell git describe --always --tags)
endif

DATE := $(shell date -u +%Y%m%d.%H%M%S)

LDFLAGS = -trimpath -ldflags "-X=main.version=$(VERSION)-$(DATE)"

.PHONY: sattrack clean

.DEFAULT_GOAL := sattrack

sattrack:
	go build $(LDFLAGS)

clean:
	rm -f sattrack
