#!/usr/bin/env bash

# Load Users first
sudo docker compose exec backend python3 manage.py loaddata users_data

# Load Addresses Second
sudo docker compose exec backend python3 manage.py loaddata addresses_data

# Now, we are setting up different profiles
sudo docker compose exec backend python3 manage.py loaddata profiles_data

# Setting up product categories
sudo docker compose exec backend python3 manage.py loaddata categories_data

# Products are ready to be added for each corresponding seller
sudo docker compose exec backend python3 manage.py loaddata men_fashion_products_data
sudo docker compose exec backend python3 manage.py loaddata women_fashion_products_data
sudo docker compose exec backend python3 manage.py loaddata electronics_products_data
sudo docker compose exec backend python3 manage.py loaddata kids'_fashion_products_data
sudo docker compose exec backend python3 manage.py loaddata home_&_lifestyle_products_data
