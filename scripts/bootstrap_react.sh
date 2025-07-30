#!/usr/bin/env bash

# Bootstrap the Vite React app
sudo docker run --rm -it \
  -v ${PWD}:/app \
  -w /app node:20-alpine \
  sh -c "\
    npm create vite@latest . -- --template react -y && \
    npm install -y"

sudo chown -R ${USER}:${USER} .
