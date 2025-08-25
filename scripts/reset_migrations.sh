#!/bin/bash

echo "🚨 WARNING: This will delete ALL database data and regenerate migrations."
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted."
    exit 1
fi

cd "$(dirname "$0")/.."

echo "🧹 Deleting old migration files..."
find backend -path "*/migrations/*.py" -not -name "__init__.py" -delete
find backend -path "*/migrations/*.pyc" -delete

echo "🗑️ Stopping containers and removing volumes..."
sudo docker compose down -v

echo "🐳 Rebuilding containers..."
sudo docker compose up -d --build

echo "⚙️ Making fresh migrations..."
sudo docker compose exec backend python manage.py makemigrations

echo "📦 Applying migrations..."
sudo docker compose exec backend python manage.py migrate

echo "✅ Reset complete! Fresh migrations and empty DB are ready."
