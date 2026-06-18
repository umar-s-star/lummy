# Lummy Backend

FastAPI + SQLite REST API for the Lummy restaurant website.

## Quick start

```bash
cd backend
pip install -r requirements.txt
python main.py
```

API runs on **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/dishes | List all dishes |
| POST | /api/dishes | Create dish |
| PUT | /api/dishes/:id | Update dish |
| DELETE | /api/dishes/:id | Delete dish |
| GET | /api/categories | List categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |
| GET | /api/branches | List branches |
| POST | /api/branches | Create branch |
| PUT | /api/branches/:id | Update branch |
| DELETE | /api/branches/:id | Delete branch |
| GET | /api/promos | List active promos |
| POST | /api/promos | Create promo |
| DELETE | /api/promos/:id | Delete promo |
| POST | /api/upload | Upload image → returns { url } |
| GET | /api/health | Health check |
