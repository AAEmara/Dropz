#!/usr/bin/env bash

# Freezes the current python dependencies
sudo docker compose exec backend pip freeze > requirements.txt
