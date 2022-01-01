FROM golang:1.17.5 as sattrack_runner

WORKDIR /app
COPY . .

RUN go get -d -v ./...
RUN make sattrack

WORKDIR /app/build
RUN mv /app/sattrack /app/build
RUN mkdir /app/build/database

ENTRYPOINT [ "/app/build/sattrack", "-update" ]

EXPOSE 8000
