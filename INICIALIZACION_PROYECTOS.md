# Guía de Inicialización y Ejecución de Proyectos (Ubuntu) - Alquiler de Vehículos

Esta guía contiene los comandos para inicializar y ejecutar los 3 componentes del sistema en Ubuntu Linux: **API Backend (Django)**, **UI Web (React/Vite)** y **App Móvil (React Native Expo)** para el **Sistema Básico de Gestión de Vehículos y Reservas para una Empresa de Alquiler de Vehículos**.

---

## 1. Backend API (airport_api / rental_backend)

### Paso 1: Configurar la Base de Datos Relacional (PostgreSQL: `rental_db`)
```sql
CREATE USER backend_user WITH PASSWORD 'admin123';
CREATE DATABASE rental_db OWNER backend_user;

\c rental_db

ALTER SCHEMA public OWNER TO backend_user;
GRANT ALL ON SCHEMA public TO backend_user;
```

### Paso 2: Configurar la Base de Datos NoRelacional (MongoDB: `rental_logs`)
```javascript
mongosh
use rental_logs
db.createUser({
  user: "mongo_backend_user",
  pwd: "exa_2026_ute",
  roles: [{ role: "readWrite", db: "rental_logs" }]
})
```

### Paso 3: Configurar Entorno e Instalar Dependencias
```bash
cd airport_api
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework psycopg2-binary django-cors-headers python-dotenv pymongo django-filter
```

### Paso 4: Configurar Archivo `.env`
Crear el archivo `airport_api/.env` con la siguiente configuración:

```env
DEBUG=1
SECRET_KEY=dev-secret-key
DB_NAME=rental_db
DB_USER=backend_user
DB_PASSWORD=admin123
DB_HOST=127.0.0.1
DB_PORT=5432
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=rental_logs
CORS_ORIGIN=http://localhost:5173
```

### Paso 5: Ejecutar Migraciones y Servidor
```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver 0.0.0.0:8000
```

---

## 2. Web UI (aiport-ui) - Consume SQL (vehicles y reservations)

### Paso 1: Navegar e Instalar Dependencias
```bash
cd aiport-ui
npm install
```

### Paso 2: Configurar Variables de Entorno (`.env`)
Crear el archivo `aiport-ui/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Paso 3: Iniciar Servidor de Desarrollo
```bash
npm run dev
```

---

## 3. Mobile App React Native / RM (airport-rn) - Consume NoSQL (customers y inspection_reports)

### Paso 1: Navegar e Instalar Dependencias
```bash
cd airport-rn
npm install
```

### Paso 2: Iniciar Expo
```bash
npm start
```

---

## Resumen de Comandos en 3 Terminales de Ubuntu

### Terminal 1 (API - Backend Django)
```bash
cd airport_api
source venv/bin/activate
python3 manage.py runserver 0.0.0.0:8000
```

### Terminal 2 (UI - Web Frontend React)
```bash
cd aiport-ui
npm run dev
```

### Terminal 3 (RN / RM - Mobile App React Native Expo)
```bash
cd airport-rn
npm start
```
