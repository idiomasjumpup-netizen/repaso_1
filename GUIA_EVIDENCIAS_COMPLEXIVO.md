# EXAMEN COMPLEXIVO PRÁCTICO: Sistema Básico de Gestión de Productos y Pedidos para una Panadería

## Sumario
- EXAMEN COMPLEXIVO PRÁCTICO
- Indicaciones Generales
- SECCIÓN 1: BASE DE DATOS RELACIONAL (POSTGRESQL)
- SECCIÓN 2: BASE DE DATOS NO RELACIONAL (MONGODB)
- SECCIÓN 3: BACKEND – DJANGO REST
- SECCIÓN 4: FRONTEND – REACTJS
- SECCIÓN 5: APLICACIÓN MÓVIL – REACT NATIVE
- SECCIÓN 6: SISTEMAS OPERATIVOS – UBUNTU (MÁQUINA VIRTUAL)

---

**Cohorte:** 2024-2  
**Ciclo:** 2026-1  

### Indicaciones Generales
Todas las capturas deben mostrar:
- Fecha y hora visible del sistema.
- Terminal o navegador completo (sin recortes parciales).
- Las capturas deben estar numeradas consecutivamente del 1 al 30.
- Deben entregarse en un único documento PDF o Word ordenado según esta plantilla.
- No se aceptarán imágenes editadas o fragmentadas.

**NOMBRES Y APELLIDOS:** [Completar Nombre]  
**CÉDULA:** [Completar Cédula]  
**URL REPOSITORIO:** [URL del Repositorio Git]  

---

# SECCIÓN 1: BASE DE DATOS RELACIONAL (POSTGRESQL - bakery_db)

### Captura 1 – Creación de Base de Datos
Mostrar en terminal el comando de creación de la base de datos y el resultado exitoso.
* **Comando a ejecutar en psql:**
  ```sql
  CREATE DATABASE bakery_db;
  ```
* **Qué evidenciar:** Salida de psql con la respuesta `CREATE DATABASE`.

### Captura 2 – Creación de Usuario y Asignación de Permisos
Mostrar los comandos utilizados para crear el usuario y asignar permisos mínimos necesarios.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE USER backend_user WITH PASSWORD 'admin123';
  GRANT ALL PRIVILEGES ON DATABASE bakery_db TO backend_user;
  \c bakery_db
  ALTER SCHEMA public OWNER TO backend_user;
  GRANT ALL ON SCHEMA public TO backend_user;
  ```
* **Qué evidenciar:** Salidas `CREATE ROLE`, `GRANT` y `ALTER SCHEMA`.

### Captura 3 – Conexión con el Usuario Creado
Mostrar conexión exitosa mediante psql y listado de bases de datos.
* **Comando en la terminal de Ubuntu:**
  ```bash
  psql -U backend_user -d bakery_db -h 127.0.0.1
  ```
* **Comando dentro de psql:**
  ```sql
  \l
  ```
* **Qué evidenciar:** Prompt `bakery_db=>` y el listado de bases de datos donde figure `bakery_db` asignada a `backend_user`.

### Captura 4 – Tablas Generadas por Migración
Mostrar el listado de tablas creadas mediante migraciones (comando \dt).
* **Comando a ejecutar en psql:**
  ```sql
  \dt
  ```
* **Qué evidenciar:** El listado de tablas creadas por Django (`products`, `orders`, `django_migrations`).

### Captura 5 – Estructura de Tablas
Mostrar la estructura detallada de las dos tablas principales (comando \d nombre_tabla), donde se evidencien tipos de datos.
* **Comandos a ejecutar en psql:**
  ```sql
  \d products
  \d orders
  ```
* **Qué evidenciar:** Las columnas y tipos de datos (`bigint`, `character varying(50)`, `character varying(20)`, `boolean`, `timestamp with time zone`) y la clave foránea `product_id REFERENCES products(id)`.

### Captura 6 – Creación de Índice
Mostrar el comando de creación del índice y la verificación de su existencia.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE INDEX idx_orders_status ON orders(status);
  \d orders
  EXPLAIN SELECT * FROM orders WHERE status = 'RECEIVED';
  ```
* **Qué evidenciar:** Salida `CREATE INDEX`, el índice `idx_orders_status` en `\d orders` y la ejecución de `EXPLAIN`.

### Captura 7 – Creación de Vista
Mostrar el comando de creación de la vista y una consulta ejecutada sobre ella.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE VIEW vw_pending_orders AS
  SELECT 
      o.id AS order_id,
      o.customer_name,
      p.name AS product_name,
      p.category AS product_category,
      o.status,
      o.order_time,
      o.created_at
  FROM orders o
  JOIN products p ON o.product_id = p.id
  WHERE o.status IN ('RECEIVED', 'BAKING');

  SELECT * FROM vw_pending_orders;
  ```
* **Qué evidenciar:** Mensaje `CREATE VIEW` y el resultado de la consulta `SELECT * FROM vw_pending_orders;`.

### Captura 8 – Función o Trigger
Mostrar la creación y prueba funcional de la función o trigger implementado.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE OR REPLACE FUNCTION check_order_time()
  RETURNS TRIGGER AS $$
  BEGIN
      IF NEW.order_time > NEW.created_at + INTERVAL '1 day' THEN
          RAISE EXCEPTION 'La fecha del pedido no puede superar 1 día de la fecha de registro';
      END IF;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_check_order_time
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION check_order_time();

  -- Prueba funcional
  INSERT INTO products (name, category, is_available) VALUES ('Pan Baguette', 'PAN', true);
  INSERT INTO orders (product_id, customer_name, status, order_time) VALUES (1, 'Carlos Mendoza', 'RECEIVED', NOW());
  ```
* **Qué evidenciar:** Salidas `CREATE FUNCTION`, `CREATE TRIGGER` e `INSERT 0 1`.

---

# SECCIÓN 2: BASE DE DATOS NO RELACIONAL (MONGODB - bakery_logs)

### Captura 9 – Creación y Selección de Base de Datos
Mostrar el uso de la base de datos desde mongosh.
* **Comando en mongosh:**
  ```javascript
  use bakery_logs
  ```
* **Qué evidenciar:** Mensaje `switched to db bakery_logs`.

### Captura 10 – Creación de Usuario
Mostrar el comando de creación del usuario con roles asignados.
* **Comando en mongosh:**
  ```javascript
  db.createUser({
    user: "mongo_backend_user",
    pwd: "exa_2026_ute",
    roles: [ { role: "readWrite", db: "bakery_logs" } ]
  })
  ```
* **Qué evidenciar:** La respuesta `{ ok: 1 }`.

### Captura 11 – Creación o Verificación de Colecciones
Mostrar las colecciones existentes y la inserción de un documento de prueba.
* **Comandos en mongosh:**
  ```javascript
  db.suppliers.insertOne({
    name: "Harinera San Luis",
    code: "HAR",
    country: "Ecuador",
    is_active: true,
    created_at: new Date()
  })

  db.baking_sheets.insertOne({
    order_id: NumberLong(1),
    oven_batch: "LOTE-A",
    temperature_c: 180,
    estimated_ready_at: new Date(),
    notes: "Hoja de horneado inicial",
    created_at: new Date()
  })

  show collections
  ```
* **Qué evidenciar:** Inserción exitosa `{ acknowledged: true }` y el listado de colecciones (`suppliers`, `baking_sheets`).

### Captura 12 – Creación de Índice
Mostrar el comando createIndex() y la verificación con getIndexes().
* **Comandos en mongosh:**
  ```javascript
  db.baking_sheets.createIndex({ order_id: 1 })
  db.baking_sheets.getIndexes()
  ```
* **Qué evidenciar:** Nombre del índice `order_id_1` y arreglo de `getIndexes()`.

### Captura 13 – Consulta por Identificador
Mostrar una consulta filtrando por el identificador relacionado con la tabla relacional.
* **Comando en mongosh:**
  ```javascript
  db.baking_sheets.find({ order_id: NumberLong(1) })
  ```
* **Qué evidenciar:** Documento JSON con `order_id: 1`, `oven_batch`, `temperature_c`, etc.

### Captura 14 – Consulta por Rango de Fechas
Mostrar una consulta utilizando el campo de fecha.
* **Comando en mongosh:**
  ```javascript
  db.baking_sheets.find({
    created_at: {
      $gte: ISODate("2026-01-01T00:00:00Z"),
      $lte: ISODate("2026-12-31T23:59:59Z")
    }
  })
  ```
* **Qué evidenciar:** Documentos que coincidan en el rango de fechas.

---

# SECCIÓN 3: BACKEND – DJANGO REST

### Captura 15 – Creación del Proyecto y Aplicación
Mostrar estructura del proyecto y aplicación creada.
* **Comandos en Ubuntu:**
  ```bash
  cd airport_api
  tree -L 2 .
  ls -la gestion/
  ```
* **Qué evidenciar:** Estructura de archivos con `manage.py`, `config/` y `gestion/`.

### Captura 16 – Migraciones Ejecutadas
Mostrar ejecución de makemigrations y migrate.
* **Comandos en Ubuntu:**
  ```bash
  python3 manage.py makemigrations
  python3 manage.py migrate
  ```
* **Qué evidenciar:** Salida indicando `Applying gestion.0001_initial... OK`.

### Captura 17 – Servidor en Ejecución
Mostrar el servidor corriendo correctamente.
* **Comando en Ubuntu:**
  ```bash
  python3 manage.py runserver 0.0.0.0:8000
  ```
* **Qué evidenciar:** Mensaje `Starting development server at http://0.0.0.0:8000/`.

### Captura 18 – Endpoint GET Funcional
Mostrar respuesta JSON en navegador o Postman.
* **URL:** `http://127.0.0.1:8000/api/products/`
* **Qué evidenciar:** Respuesta `200 OK` con la lista de productos en JSON.

### Captura 19 – Endpoint POST Funcional
Mostrar inserción exitosa de un registro e integración con MongoDB.
* **URL:** `http://127.0.0.1:8000/api/orders/` (Método `POST`)
* **Body (JSON):**
  ```json
  {
    "product": 1,
    "customer_name": "Carlos Mendoza",
    "status": "RECEIVED",
    "oven_batch": "LOTE-A",
    "temperature_c": 180,
    "notes": "Horneado crujiente"
  }
  ```
* **Qué evidenciar:** Respuesta `201 Created` con el pedido generado y la hoja de horneado creada en MongoDB.

---

# SECCIÓN 4: FRONTEND – REACTJS (SQL)

### Captura 20 – Proyecto React en Ejecución
Mostrar terminal con servidor activo.
* **Comandos en Ubuntu:**
  ```bash
  cd aiport-ui
  npm run dev
  ```
* **Qué evidenciar:** Salida de Vite corriendo en `http://localhost:5173/`.

### Captura 21 – Listado de Registros
Mostrar en navegador la lista obtenida desde el backend.
* **URL:** `http://localhost:5173/`
* **Qué evidenciar:** Página web mostrando la lista de productos y pedidos obtenidas desde PostgreSQL.

### Captura 22 – Registro Nuevo Desde la Interfaz
Mostrar creación de un nuevo registro y actualización del listado.
* **Qué evidenciar:** Formulario de pedido completado y lista de pedidos actualizada automáticamente.

---

# SECCIÓN 5: APLICACIÓN MÓVIL – REACT NATIVE (NoSQL)

### Captura 23 – Proyecto Móvil Creado
Mostrar terminal con proyecto inicializado.
* **Comandos en Ubuntu:**
  ```bash
  cd airport-rn
  npm start
  ```
* **Qué evidenciar:** Consola Metro Bundler / Expo iniciada.

### Captura 24 – Aplicación Ejecutándose
Mostrar pantalla principal en emulador o dispositivo.
* **Qué evidenciar:** Pantalla principal de la app móvil Panadería San Gabriel en ejecución.

### Captura 25 – Consumo de API NoSQL
Mostrar datos provenientes de las colecciones no relacionales.
* **Qué evidenciar:** Pantalla de Proveedores (`suppliers`) o Hojas de Horneado (`baking_sheets`) cargando datos desde MongoDB.

---

# SECCIÓN 6: SISTEMAS OPERATIVOS – UBUNTU (MÁQUINA VIRTUAL)

### Captura 26 – Creación de Estructura de Directorios
Mostrar comandos mkdir y verificación con tree.
* **Comandos en Ubuntu:**
  ```bash
  mkdir -p examen/panaderia/{backend,frontend,movil,docs}
  tree examen/panaderia
  ```
* **Qué evidenciar:** Árbol de directorios resultante del comando `tree`.

### Captura 27 – Navegación y Listado
Mostrar uso de cd, pwd y ls -la.
* **Comandos en Ubuntu:**
  ```bash
  cd examen/panaderia
  pwd
  ls -la
  ```
* **Qué evidenciar:** Salida de `pwd` (/home/usuario/examen/panaderia) y listado `ls -la`.

### Captura 28 – Redirección de Salida
Mostrar uso de > y >> con comandos básicos.
* **Comandos en Ubuntu:**
  ```bash
  who > docs/evidencia.txt
  ls -la >> docs/evidencia.txt
  cat docs/evidencia.txt
  ```
* **Qué evidenciar:** Salida de `cat docs/evidencia.txt` con la información concatenada.

### Captura 29 – Búsqueda con grep
Mostrar búsqueda de texto dentro de un archivo.
* **Comandos en Ubuntu:**
  ```bash
  cat << 'EOF' > docs/comandos.txt
  Proyecto Panadería - Backend
  GET /api/orders/
  GET /api/orders/12/
  POST /api/orders/
  DELETE /api/orders/6/
  INFO: order created successfully
  INFO: orders service running
  WARN: order delay detected
  EOF

  grep -n "order" docs/comandos.txt
  ```
* **Qué evidenciar:** Líneas halladas y numeradas por `grep -n`.

### Captura 30 – Permisos y Sticky Bit
Mostrar uso de chmod y verificación de permisos con ls -ld.
* **Comandos en Ubuntu:**
  ```bash
  ls -ld docs
  chmod 755 docs
  mkdir shared
  chmod 1777 shared
  ls -ld shared
  ```
* **Qué evidenciar:** Permisos modificados de `docs` y permisos `drwxrwxrwt` de `shared` con el Sticky Bit `t`.
