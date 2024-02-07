FROM golang:1-alpine as build

WORKDIR /app

COPY ./vendor ./vendor
COPY go.* main.go ./
COPY ./commands ./commands
COPY ./models ./models
COPY ./util ./util

RUN go build -o bin/load-data ./

FROM scratch

COPY --from=build /app/bin/load-data /usr/bin/load-data

ENTRYPOINT ["/usr/bin/load-data"]
