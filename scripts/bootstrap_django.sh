#!/usr/bin/bash

# Bootstrap Django project in a virtualenv
sudo docker run -it --rm \
  -v ${PWD}:/app \
  -w /app python:3.12-slim \
  bash -c "\
    pip install --upgrade pip && \
    pip install django && \
    django-admin startproject core . && \
    pip freeze > requirements.txt"

sudo chown -R $USER:$USER .
