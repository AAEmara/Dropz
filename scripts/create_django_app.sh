#!/usr/bin/env bash

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./create_django_app.sh accounts"
  exit 1
fi

sudo docker compose exec backend python3 manage.py startapp "$APP_NAME"
sudo chown -R $USER:$USER "$APP_NAME"

echo "App '$APP_NAME' created and permissions fixed."
