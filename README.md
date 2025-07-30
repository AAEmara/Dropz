# Dropz
Dropz is a multi-sided e-commerce platform designed to connect Egyptian buyers with local suppliers and shipping companies in a seamless and efficient digital marketplace.

## Dropz - Full Stack Development Environment

This is the development environment for the **Dropz** project, combining:

- Django + Django REST Framework (Backend)
- React + Vite (Frontend)
- Docker + Docker Compose

---

## 📦 Requirements

- Docker
- Docker Compose

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-org/dropz.git
cd dropz
```

### 2. Start the project

```bash
sudo docker compose up --build
```

### 3. Access the apps

  - **Frontend (React):** [http://localhost:3000](http://localhost:3000)
  - **Backend (Django):** [http://localhost:8000](http://localhost:8000)
  - **Django Admin:** [http://localhost:8000/admin](http://localhost:8000/admin)
  - **Test API Endpoint:** [http://localhost:8000/hello](http://localhost:8000/hello)

---

## ⚙️  Development Structure

```bash
dropz/
├── frontend/         # React app (Vite)
├── backend/          # Django project
│   └── core/         # Django app (includes API views)
├── docker-compose.yml
└── README.md
```

---

## 🧪 Sample API (for testing)

We created a simple test endpoint in `backend/core/views.py`:
```python
@api_view(['GET'])
def hello_api(request):
    return Response({"message": "Hello from Django API!"})
```

Accessible at: `http://localhost:8000/hello/`

---

## 🔐 Admin Login

Create a superuser:

```bash
sudo docker compose exec backend python manage.py createsuperuser
```

Then access: [http://localhost:8000/admin](http://localhost:8000/admin)

---

## 🛠 Useful Commands

```bash
# Run migrations
docker compose exec backend python manage.py migrate

# Install frontend packages
docker compose exec frontend npm install

# Access backend shell
docker compose exec backend python manage.py shell
```

## 🧩 Environment Notes

  - CORS is enabled for `http://localhost:3000`
  - Docker volumes are used to persist backend state
