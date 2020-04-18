# Dockerfile for running platform-specific tests locally

FROM node:latest

COPY . /app
WORKDIR /app

RUN npm install
RUN npm link

ENTRYPOINT ["npm", "test"]
