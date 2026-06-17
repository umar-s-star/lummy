"""
Lummy Restaurant — Python Backend
Запуск: python main.py
Docs:   http://localhost:8000/docs
"""

import sqlite3
import json
import os
import base64
import uuid
from datetime import datetime
from pathlib import Path
from contextlib import contextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

# ── Paths ───────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DB_PATH  = BASE_DIR / "lummy.db"
UPLOADS  = BASE_DIR / "uploads"
UPLOADS.mkdir(exist_ok=True)

app = FastAPI(title="Lummy API", version="1.0.0")

# ── CORS (allow frontend dev server) ────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files (uploaded images) ──────────────────────────
app.mount("/uploads", StaticFiles(directory=str(UPLOADS)), name="uploads")

# ════════════════════════════════════════════════════════════
#  DATABASE
# ════════════════════════════════════════════════════════════
@contextmanager
def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Create tables and seed initial data if empty."""
    with get_db() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS categories (
            id          TEXT PRIMARY KEY,
            name_ru     TEXT NOT NULL,
            name_uz     TEXT NOT NULL,
            name_uz_cyrl TEXT NOT NULL,
            slug        TEXT NOT NULL,
            icon        TEXT DEFAULT '🍽️',
            image       TEXT,
            is_active   INTEGER DEFAULT 1,
            sort_order  INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS dishes (
            id              TEXT PRIMARY KEY,
            name_ru         TEXT NOT NULL,
            name_uz         TEXT NOT NULL,
            name_uz_cyrl    TEXT NOT NULL,
            description_ru  TEXT DEFAULT '',
            description_uz  TEXT DEFAULT '',
            description_uz_cyrl TEXT DEFAULT '',
            price           INTEGER NOT NULL,
            old_price       INTEGER,
            image           TEXT DEFAULT '',
            weight          INTEGER,
            calories        INTEGER,
            proteins        REAL,
            fats            REAL,
            carbs           REAL,
            category_id     TEXT NOT NULL,
            is_bestseller   INTEGER DEFAULT 0,
            is_new          INTEGER DEFAULT 0,
            in_stock        INTEGER DEFAULT 1,
            is_hidden       INTEGER DEFAULT 0,
            gallery         TEXT DEFAULT '[]',
            rating          REAL,
            review_count    INTEGER,
            created_at      TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS branches (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            address     TEXT NOT NULL,
            phone       TEXT NOT NULL,
            hours       TEXT NOT NULL,
            lat         REAL NOT NULL,
            lng         REAL NOT NULL,
            is_main     INTEGER DEFAULT 0,
            image       TEXT,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS promos (
            id              TEXT PRIMARY KEY,
            title_ru        TEXT NOT NULL,
            title_uz        TEXT NOT NULL,
            description_ru  TEXT DEFAULT '',
            description_uz  TEXT DEFAULT '',
            image           TEXT DEFAULT '',
            code            TEXT,
            discount        INTEGER,
            is_active       INTEGER DEFAULT 1,
            expires_at      TEXT
        );

        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        """)

        # Add columns to existing dbs that predate them
        try:
            db.execute("ALTER TABLE dishes ADD COLUMN gallery TEXT DEFAULT '[]'")
        except Exception:
            pass  # column already exists
        try:
            db.execute("ALTER TABLE categories ADD COLUMN image TEXT")
        except Exception:
            pass  # column already exists

        # Seed if empty
        count = db.execute("SELECT COUNT(*) FROM categories").fetchone()[0]
        if count == 0:
            _seed(db)


def _seed(db):
    categories = [
        ("1","Авторские десерты","Mualliflik desertlari","Муаллифлик десертлари","desserts","🍰",None,1,1),
        ("2","Торты","Tortlar","Тортлар","cakes","🎂",None,1,2),
        ("3","Кофе","Qahva","Қаҳва","coffee","☕",None,1,3),
        ("4","Завтраки","Nonushta","Нонушта","breakfast","🥐",None,1,4),
        ("5","Основные блюда","Asosiy taomlar","Асосий таомлар","mains","🍽️",None,1,5),
        ("6","Салаты","Salatlar","Салатлар","salads","🥗",None,1,6),
        ("7","Напитки","Ichimliklar","Ичимликлар","drinks","🥤",None,1,7),
        ("8","Чай","Choy","Чой","tea","🍵",None,1,8),
    ]
    db.executemany(
        "INSERT INTO categories VALUES (?,?,?,?,?,?,?,?,?)",
        categories
    )

    dishes = [
        ("1","Торт «Лесные ягоды»","O'rmon mevali tort","Ўрмон мевали торт",
         "Нежный бисквит с кремом из маскарпоне","","",
         85000,100000,"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
         350,420,8,22,48,"2",1,0,1,0,4.9,124),
        ("2","Капучино Signature","Signature Kapuchino","Signature Капучино",
         "Двойной эспрессо с нежной молочной пенкой","","",
         42000,None,"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
         300,180,6,8,22,"3",1,0,1,0,4.8,89),
        ("3","Эклер «Карамель»","Karamel Ekler","Карамель Эклер",
         "Классический заварной эклер с кремом крем-брюле","","",
         35000,None,"https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80",
         120,320,5,16,40,"1",0,1,1,0,4.7,56),
        ("4","Яйца Бенедикт","Benedikt tuxumlari","Бенедикт тухумлари",
         "Яйца пашот на тостах с голландским соусом","","",
         68000,None,"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
         280,520,28,32,24,"4",1,0,1,0,4.6,43),
        ("5","Тирамису Lummy","Lummy Tiramisu","Lummy Тирамису",
         "Классический тирамису с маскарпоне","","",
         55000,None,"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
         200,380,7,20,42,"1",1,0,1,0,4.9,178),
        ("6","Лосось Терияки","Teriyaki Losos","Терияки Лосось",
         "Филе лосося в соусе терияки с рисом","","",
         125000,None,"https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&q=80",
         350,480,38,18,32,"5",0,1,1,0,4.7,31),
        ("7","Круассан миндальный","Bodomli kruassan","Бодомли круассан",
         "Нежный слоёный круассан с миндальным кремом","","",
         28000,None,"https://images.unsplash.com/photo-1606313564200-e75d5e30ef07?w=600&q=80",
         90,380,8,22,36,"4",0,0,1,0,4.5,67),
        ("8","Матча Латте","Matcha Latte","Матча Латте",
         "Японский зелёный чай матча","","",
         48000,None,"https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&q=80",
         350,180,8,6,24,"8",0,1,1,0,4.6,44),
        ("9","Чизкейк «Нью-Йорк»","Nyu-York Chizkeyk","Нью-Йорк Чизкейк",
         "Классический нью-йоркский чизкейк","","",
         62000,None,"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
         180,450,9,28,44,"1",1,0,1,0,4.8,92),
        ("10","Макарон ассорти","Makaron assortimenti","Макарон ассортименти",
         "Набор из 6 французских макарон","","",
         72000,None,"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
         120,480,6,18,68,"1",1,0,1,0,4.9,210),
    ]
    db.executemany(
        "INSERT INTO dishes VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))",
        dishes
    )

    db.executemany(
        "INSERT INTO branches VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
            ("1","Lummy Seoul Mun","Seoul Mun ko`chasi, Toshkent",
             "+998 94 818 68 68","09:00 – 23:00",41.2967,69.2406,1,
             "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80",
             "Главный флагманский ресторан"),
            ("2","Lummy Yunusobod","Юнусобод тумани, Ташкент",
             "+998 94 818 68 70","10:00 – 22:00",41.3270,69.2924,0,
             "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
             "Уютный ресторан в Юнусободе"),
        ]
    )

    db.execute("INSERT INTO settings VALUES ('site_name','Lummy')")
    db.execute("INSERT INTO settings VALUES ('phone','+998 94 818 68 68')")
    db.execute("INSERT INTO settings VALUES ('email','hello@lummy.uz')")


# ── startup ─────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    init_db()
    print(f"\n✅  Lummy API ready  →  http://localhost:8000")
    print(f"📚  Docs            →  http://localhost:8000/docs\n")


# ════════════════════════════════════════════════════════════
#  HELPERS
# ════════════════════════════════════════════════════════════
def row_to_dict(row):
    return dict(row) if row else None


def rows_to_list(rows):
    return [dict(r) for r in rows]


# ════════════════════════════════════════════════════════════
#  SCHEMAS
# ════════════════════════════════════════════════════════════
class CategoryIn(BaseModel):
    name_ru: str
    name_uz: str = ""
    name_uz_cyrl: str = ""
    slug: str = ""
    icon: str = "🍽️"
    image: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class DishIn(BaseModel):
    name_ru: str
    name_uz: str = ""
    name_uz_cyrl: str = ""
    description_ru: str = ""
    description_uz: str = ""
    description_uz_cyrl: str = ""
    price: int
    old_price: Optional[int] = None
    image: str = ""
    gallery: list = []
    weight: Optional[int] = None
    calories: Optional[int] = None
    proteins: Optional[float] = None
    fats: Optional[float] = None
    carbs: Optional[float] = None
    category_id: str
    is_bestseller: bool = False
    is_new: bool = False
    in_stock: bool = True
    is_hidden: bool = False


class BranchIn(BaseModel):
    name: str
    address: str
    phone: str
    hours: str
    lat: float
    lng: float
    is_main: bool = False
    image: Optional[str] = None
    description: Optional[str] = None


class PromoIn(BaseModel):
    title_ru: str
    title_uz: str = ""
    description_ru: str = ""
    description_uz: str = ""
    image: str = ""
    code: Optional[str] = None
    discount: Optional[int] = None
    is_active: bool = True
    expires_at: Optional[str] = None


# ════════════════════════════════════════════════════════════
#  CATEGORIES
# ════════════════════════════════════════════════════════════
@app.get("/api/categories")
def list_categories():
    with get_db() as db:
        rows = db.execute("SELECT * FROM categories ORDER BY sort_order").fetchall()
    return rows_to_list(rows)


@app.post("/api/categories", status_code=201)
def create_category(body: CategoryIn):
    new_id = str(uuid.uuid4())[:8]
    slug = body.slug or body.name_ru.lower().replace(" ", "-")
    with get_db() as db:
        db.execute(
            "INSERT INTO categories VALUES (?,?,?,?,?,?,?,?,?)",
            (new_id, body.name_ru, body.name_uz or body.name_ru,
             body.name_uz_cyrl or body.name_ru, slug, body.icon, body.image,
             int(body.is_active), body.sort_order)
        )
    return {"id": new_id, **body.dict()}


@app.put("/api/categories/{cat_id}")
def update_category(cat_id: str, body: CategoryIn):
    with get_db() as db:
        row = db.execute("SELECT id FROM categories WHERE id=?", (cat_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Category not found")
        slug = body.slug or body.name_ru.lower().replace(" ", "-")
        db.execute(
            "UPDATE categories SET name_ru=?,name_uz=?,name_uz_cyrl=?,slug=?,icon=?,image=?,is_active=?,sort_order=? WHERE id=?",
            (body.name_ru, body.name_uz or body.name_ru, body.name_uz_cyrl or body.name_ru,
             slug, body.icon, body.image, int(body.is_active), body.sort_order, cat_id)
        )
    return {"id": cat_id, **body.dict()}


@app.delete("/api/categories/{cat_id}")
def delete_category(cat_id: str):
    with get_db() as db:
        db.execute("DELETE FROM categories WHERE id=?", (cat_id,))
    return {"ok": True}


# ════════════════════════════════════════════════════════════
#  DISHES
# ════════════════════════════════════════════════════════════
@app.get("/api/dishes")
def list_dishes(category_id: Optional[str] = None, hidden: bool = False):
    with get_db() as db:
        q = "SELECT * FROM dishes WHERE 1=1"
        params: list = []
        if not hidden:
            q += " AND is_hidden=0"
        if category_id:
            q += " AND category_id=?"
            params.append(category_id)
        q += " ORDER BY created_at DESC"
        rows = db.execute(q, params).fetchall()
    return rows_to_list(rows)


@app.get("/api/dishes/{dish_id}")
def get_dish(dish_id: str):
    with get_db() as db:
        row = db.execute("SELECT * FROM dishes WHERE id=?", (dish_id,)).fetchone()
    if not row:
        raise HTTPException(404, "Dish not found")
    return row_to_dict(row)


@app.post("/api/dishes", status_code=201)
def create_dish(body: DishIn):
    new_id = str(uuid.uuid4())[:8]
    with get_db() as db:
        db.execute(
            """INSERT INTO dishes
            (id,name_ru,name_uz,name_uz_cyrl,description_ru,description_uz,description_uz_cyrl,
            price,old_price,image,weight,calories,proteins,fats,carbs,
            category_id,is_bestseller,is_new,in_stock,is_hidden)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (new_id, body.name_ru, body.name_uz or body.name_ru, body.name_uz_cyrl or body.name_ru,
             body.description_ru, body.description_uz, body.description_uz_cyrl,
             body.price, body.old_price, body.image,
             body.weight, body.calories, body.proteins, body.fats, body.carbs,
             body.category_id, int(body.is_bestseller), int(body.is_new),
             int(body.in_stock), int(body.is_hidden))
        )
    return {"id": new_id, **body.dict()}


@app.put("/api/dishes/{dish_id}")
def update_dish(dish_id: str, body: DishIn):
    with get_db() as db:
        row = db.execute("SELECT id FROM dishes WHERE id=?", (dish_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Dish not found")
        db.execute(
            """UPDATE dishes SET
            name_ru=?,name_uz=?,name_uz_cyrl=?,description_ru=?,description_uz=?,description_uz_cyrl=?,
            price=?,old_price=?,image=?,weight=?,calories=?,proteins=?,fats=?,carbs=?,
            category_id=?,is_bestseller=?,is_new=?,in_stock=?,is_hidden=?
            WHERE id=?""",
            (body.name_ru, body.name_uz or body.name_ru, body.name_uz_cyrl or body.name_ru,
             body.description_ru, body.description_uz, body.description_uz_cyrl,
             body.price, body.old_price, body.image,
             body.weight, body.calories, body.proteins, body.fats, body.carbs,
             body.category_id, int(body.is_bestseller), int(body.is_new),
             int(body.in_stock), int(body.is_hidden), dish_id)
        )
    return {"id": dish_id, **body.dict()}


@app.delete("/api/dishes/{dish_id}")
def delete_dish(dish_id: str):
    with get_db() as db:
        db.execute("DELETE FROM dishes WHERE id=?", (dish_id,))
    return {"ok": True}


@app.patch("/api/dishes/{dish_id}/toggle-hidden")
def toggle_hidden(dish_id: str):
    with get_db() as db:
        row = db.execute("SELECT is_hidden FROM dishes WHERE id=?", (dish_id,)).fetchone()
        if not row:
            raise HTTPException(404)
        new_val = 1 - row["is_hidden"]
        db.execute("UPDATE dishes SET is_hidden=? WHERE id=?", (new_val, dish_id))
    return {"is_hidden": bool(new_val)}


# ════════════════════════════════════════════════════════════
#  IMAGE UPLOAD
# ════════════════════════════════════════════════════════════
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files allowed")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    name = f"{uuid.uuid4().hex}.{ext}"
    path = UPLOADS / name
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 5 MB)")
    path.write_bytes(content)
    return {"url": f"/uploads/{name}"}


# ════════════════════════════════════════════════════════════
#  BRANCHES
# ════════════════════════════════════════════════════════════
@app.get("/api/branches")
def list_branches():
    with get_db() as db:
        rows = db.execute("SELECT * FROM branches ORDER BY is_main DESC, id").fetchall()
    return rows_to_list(rows)


@app.post("/api/branches", status_code=201)
def create_branch(body: BranchIn):
    new_id = str(uuid.uuid4())[:8]
    with get_db() as db:
        db.execute(
            "INSERT INTO branches VALUES (?,?,?,?,?,?,?,?,?,?)",
            (new_id, body.name, body.address, body.phone, body.hours,
             body.lat, body.lng, int(body.is_main), body.image, body.description)
        )
    return {"id": new_id, **body.dict()}


@app.put("/api/branches/{branch_id}")
def update_branch(branch_id: str, body: BranchIn):
    with get_db() as db:
        row = db.execute("SELECT id FROM branches WHERE id=?", (branch_id,)).fetchone()
        if not row:
            raise HTTPException(404)
        db.execute(
            "UPDATE branches SET name=?,address=?,phone=?,hours=?,lat=?,lng=?,is_main=?,image=?,description=? WHERE id=?",
            (body.name, body.address, body.phone, body.hours,
             body.lat, body.lng, int(body.is_main), body.image, body.description, branch_id)
        )
    return {"id": branch_id, **body.dict()}


@app.delete("/api/branches/{branch_id}")
def delete_branch(branch_id: str):
    with get_db() as db:
        db.execute("DELETE FROM branches WHERE id=?", (branch_id,))
    return {"ok": True}


# ════════════════════════════════════════════════════════════
#  PROMOS
# ════════════════════════════════════════════════════════════
@app.get("/api/promos")
def list_promos(all: bool = False):
    with get_db() as db:
        q = "SELECT * FROM promos" if all else "SELECT * FROM promos WHERE is_active=1"
        rows = db.execute(q).fetchall()
    return rows_to_list(rows)


@app.post("/api/promos", status_code=201)
def create_promo(body: PromoIn):
    new_id = str(uuid.uuid4())[:8]
    with get_db() as db:
        db.execute(
            "INSERT INTO promos VALUES (?,?,?,?,?,?,?,?,?,?)",
            (new_id, body.title_ru, body.title_uz or body.title_ru,
             body.description_ru, body.description_uz,
             body.image, body.code, body.discount, int(body.is_active), body.expires_at)
        )
    return {"id": new_id, **body.dict()}


@app.put("/api/promos/{promo_id}")
def update_promo(promo_id: str, body: PromoIn):
    with get_db() as db:
        row = db.execute("SELECT id FROM promos WHERE id=?", (promo_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Promo not found")
        db.execute(
            "UPDATE promos SET title_ru=?,title_uz=?,description_ru=?,description_uz=?,image=?,code=?,discount=?,is_active=?,expires_at=? WHERE id=?",
            (body.title_ru, body.title_uz or body.title_ru, body.description_ru, body.description_uz,
             body.image, body.code, body.discount, int(body.is_active), body.expires_at, promo_id)
        )
    return {"id": promo_id, **body.dict()}


@app.delete("/api/promos/{promo_id}")
def delete_promo(promo_id: str):
    with get_db() as db:
        db.execute("DELETE FROM promos WHERE id=?", (promo_id,))
    return {"ok": True}


# ════════════════════════════════════════════════════════════
#  SETTINGS
# ════════════════════════════════════════════════════════════
@app.get("/api/settings")
def get_settings():
    with get_db() as db:
        rows = db.execute("SELECT * FROM settings").fetchall()
    return {r["key"]: r["value"] for r in rows}


@app.put("/api/settings")
def update_settings(data: dict):
    with get_db() as db:
        for k, v in data.items():
            db.execute(
                "INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                (k, str(v))
            )
    return {"ok": True}


# ════════════════════════════════════════════════════════════
#  HEALTH
# ════════════════════════════════════════════════════════════
@app.get("/api/health")
def health():
    return {"status": "ok", "db": str(DB_PATH), "time": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
