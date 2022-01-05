ifndef VERSION
VERSION := $(shell git describe --always --tags)
endif

DATE := $(shell date -u +%Y%m%d.%H%M%S)

LDFLAGS = -trimpath -ldflags "-X=main.version=$(VERSION)-$(DATE)"

.PHONY: all run sattrack-back sattrack-front clean

.DEFAULT_GOAL := all

all: sattrack-back sattrack-front

run: all
	./sattrack -update

sattrack-back:
	go build -o sattrack -v $(LDFLAGS)

sattrack-front:
	npm --prefix js i
	npm --prefix js run build
	mkdir public
	mv js/dist/* public
	rm -rf js/dist

clean:
	rm -rf sattrack public data/local.db js/dist
