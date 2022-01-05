FROM golang:1.17.5 as sattrack-back_builder

WORKDIR /app
COPY . .

RUN make sattrack-back

FROM node:16.13.1-alpine3.14 as sattrack-front_builder

WORKDIR /app
COPY js/src ./src
COPY js/index.html .
COPY js/package-lock.json .
COPY js/package.json .
COPY js/tsconfig.json .
COPY js/vite.config.ts .

RUN npm i && npm run build

FROM debian:bullseye as sattrack_runner

RUN apt-get update && apt-get install curl -y
WORKDIR /app
COPY --from=sattrack-back_builder /app/sattrack .
RUN mkdir /app/data
COPY --from=sattrack-front_builder /app/dist ./public

ENTRYPOINT [ "/app/sattrack", "-update" ]
EXPOSE 8000