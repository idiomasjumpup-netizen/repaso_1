# Guia Completa de Evidencias (Capturas 1 a 30) - Examen Complexivo Practico

Este documento contiene la guia paso a paso y los comandos para Ubuntu para generar las 30 capturas de pantalla requeridas para el examen complexivo practico.

---

> [!IMPORTANT]
> **REGLAS PARA TODAS LAS CAPTURAS:**
> 1. **Fecha y hora del sistema siempre visible** en el escritorio de Ubuntu.
> 2. **Captura de pantalla completa** de la ventana de la terminal de Ubuntu, navegador o Postman.
> 3. **Mantener la numeracion consecutiva** del 1 al 30.

---

# SECCION 1: BASE DE DATOS RELACIONAL (POSTGRESQL)

### Captura 1 – Creacion de Base de Datos
* **Objetivo:** Mostrar en la terminal de Ubuntu la creacion exitosa de la base de datos `airport_db`.
* **Comando a ejecutar en psql:**
  ```sql
  CREATE DATABASE airport_db;
  ```
* **Que evidenciar:** El mensaje `CREATE DATABASE` indicando que la base de datos se creo correctamente.

---

### Captura 2 – Creacion de Usuario y Asignacion de Permisos
* **Objetivo:** Mostrar los comandos para crear el usuario y concederle privilegios.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE USER backend_user WITH PASSWORD 'admin123';
  GRANT ALL PRIVILEGES ON DATABASE airport_db TO backend_user;
  \c airport_db
  ALTER SCHEMA public OWNER TO backend_user;
  GRANT ALL ON SCHEMA public TO backend_user;
  ```
* **Que evidenciar:** Las salidas `CREATE ROLE`, `GRANT` y `ALTER SCHEMA`.

---

### Captura 3 – Conexion con el Usuario Creado
* **Objetivo:** Iniciar sesion con el usuario `backend_user` en la BD `airport_db` y listar las bases de datos.
* **Comando a ejecutar en la terminal de Ubuntu:**
  ```bash
  psql -U backend_user -d airport_db -h 127.0.0.1
  ```
* **Dentro de psql:**
  ```sql
  \l
  ```
* **Que evidenciar:** El prompt de la terminal mostrando `airport_db=>` y el listado de bases de datos donde figure `airport_db` asignada a `backend_user`.

---

### Captura 4 – Tablas Generadas por Migracion
* **Objetivo:** Mostrar el listado de tablas creadas tras ejecutar las migraciones de Django.
* **Comando a ejecutar en psql:**
  ```sql
  \dt
  ```
* **Que evidenciar:** El listado de tablas creadas (`gestion_gate`, `gestion_flight`, `django_migrations`).

---

### Captura 5 – Estructura de Tablas
* **Objetivo:** Mostrar la estructura detallada y tipos de datos de las dos tablas principales.
* **Comandos a ejecutar en psql:**
  ```sql
  \d gestion_gate
  \d gestion_flight
  ```
* **Que evidenciar:** Las columnas, tipos de datos (`character varying`, `boolean`, `timestamp with time zone`, `integer`), claves primarias y foraneas.

---

### Captura 6 – Creacion de Indice
* **Objetivo:** Mostrar la creacion de un indice b-tree y su verificacion.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE INDEX idx_flight_number ON gestion_flight(flight_number);
  \d gestion_flight
  ```
* **Que evidenciar:** La respuesta `CREATE INDEX` y en la seccion Indexes de `\d gestion_flight` la presencia de `idx_flight_number`.

---

### Captura 7 – Creacion de Vista
* **Objetivo:** Mostrar el comando de creacion de una vista SQL y una consulta SELECT ejecutada sobre ella.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE VIEW vista_vuelos_puertas AS
  SELECT 
      f.id AS vuelo_id,
      f.flight_number,
      f.destination,
      f.status,
      g.code AS puerta_codigo,
      g.terminal
  FROM gestion_flight f
  JOIN gestion_gate g ON f.gate_id = g.id;

  SELECT * FROM vista_vuelos_puertas;
  ```
* **Que evidenciar:** El mensaje `CREATE VIEW` y la tabla resultante del `SELECT * FROM vista_vuelos_puertas;`.

---

### Captura 8 – Funcion o Trigger
* **Objetivo:** Crear una funcion y trigger en PostgreSQL e insertar un registro para probar su funcionamiento.
* **Comandos a ejecutar en psql:**
  ```sql
  CREATE OR REPLACE FUNCTION auditar_vuelo()
  RETURNS TRIGGER AS $$
  BEGIN
      RAISE NOTICE 'Nuevo vuelo registrado: % con destino a %', NEW.flight_number, NEW.destination;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_auditar_vuelo
  AFTER INSERT ON gestion_flight
  FOR EACH ROW
  EXECUTE FUNCTION auditar_vuelo();

  INSERT INTO gestion_gate (code, terminal, is_available, created_at) 
  VALUES ('G-99', 'T1', true, NOW());

  INSERT INTO gestion_flight (gate_id, flight_number, destination, status, created_at) 
  VALUES (1, 'AV-500', 'Quito', 'agendado', NOW());
  ```
* **Que evidenciar:** Las salidas `CREATE FUNCTION`, `CREATE TRIGGER` y el mensaje de `NOTICE: Nuevo vuelo registrado: AV-500 con destino a Quito`.

---

# SECCION 2: BASE DE DATOS NO RELACIONAL (MONGODB)

### Captura 9 – Creacion y Seleccion de Base de Datos
* **Objetivo:** Iniciar mongosh en Ubuntu y seleccionar la base de datos `airport_logs`.
* **Comando en la terminal de Ubuntu:**
  ```bash
  mongosh
  ```
* **Dentro de mongosh:**
  ```javascript
  use airport_logs
  ```
* **Que evidenciar:** El prompt indicando `switched to db airport_logs`.

---

### Captura 10 – Creacion de Usuario
* **Objetivo:** Crear un usuario en MongoDB con roles de lectura y escritura.
* **Comando a ejecutar en mongosh:**
  ```javascript
  db.createUser({
    user: "mongo_admin",
    pwd: "adminpassword",
    roles: [ { role: "readWrite", db: "airport_logs" } ]
  })
  ```
* **Que evidenciar:** La respuesta `{ ok: 1 }` confirmando la creacion del usuario.

---

### Captura 11 – Creacion o Verificacion de Colecciones
* **Objetivo:** Mostrar las colecciones e insertar un documento de prueba.
* **Comandos a ejecutar en mongosh:**
  ```javascript
  db.flight_events.insertOne({
    flight_id: 1,
    flight_number: "AV-500",
    event_type: "Embarque Iniciado",
    details: "Pasajeros abordando en puerta G-99",
    created_at: new Date()
  })
  show collections
  ```
* **Que evidenciar:** La respuesta de insercion `{ acknowledged: true, insertedId: ObjectId(...) }` y la coleccion `flight_events` en la lista.

---

### Captura 12 – Creacion de Indice
* **Objetivo:** Crear un indice en la coleccion NoSQL y verificar su existencia.
* **Comandos a ejecutar en mongosh:**
  ```javascript
  db.flight_events.createIndex({ flight_id: 1 })
  db.flight_events.getIndexes()
  ```
* **Que evidenciar:** El mensaje con el nombre del indice creado (`flight_id_1`) y el arreglo devuelto por `getIndexes()`.

---

### Captura 13 – Consulta por Identificador
* **Objetivo:** Ejecutar una consulta filtrando por el identificador `flight_id`.
* **Comando a ejecutar en mongosh:**
  ```javascript
  db.flight_events.find({ flight_id: 1 })
  ```
* **Que evidenciar:** El documento JSON retornado con sus campos `_id`, `flight_id: 1`, `event_type`, etc.

---

### Captura 14 – Consulta por Rango de Fechas
* **Objetivo:** Filtrar documentos utilizando operadores de fecha en mongosh.
* **Comando a ejecutar en mongosh:**
  ```javascript
  db.flight_events.find({
    created_at: {
      $gte: ISODate("2026-01-01T00:00:00Z"),
      $lte: ISODate("2026-12-31T23:59:59Z")
    }
  })
  ```
* **Que evidenciar:** Los documentos que coincidan dentro del rango de fechas especificado.

---

# SECCION 3: BACKEND – DJANGO REST

### Captura 15 – Creacion del Proyecto y Aplicacion
* **Objetivo:** Mostrar en la terminal de Ubuntu la estructura de directorios del proyecto Django (`airport_api`) y la app (`gestion`).
* **Comandos en la terminal de Ubuntu:**
  ```bash
  cd airport_api
  tree -L 2 .
  ls -la gestion/
  ```
* **Que evidenciar:** La estructura de directorios con `manage.py`, `config/` y `gestion/`.

---

### Captura 16 – Migraciones Ejecutadas
* **Objetivo:** Mostrar la ejecucion de makemigrations y migrate en Ubuntu.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  python3 manage.py makemigrations
  python3 manage.py migrate
  ```
* **Que evidenciar:** Las salidas de Django `Migrations for 'gestion':` o `No changes detected` seguidas de `Applying gestion.0001_initial... OK`.

---

### Captura 17 – Servidor en Ejecucion
* **Objetivo:** Servidor backend levantado corriendo en Ubuntu.
* **Comando en la terminal de Ubuntu:**
  ```bash
  python3 manage.py runserver 0.0.0.0:8000
  ```
* **Que evidenciar:** La salida indicando `Starting development server at http://0.0.0.0:8000/`.

---

### Captura 18 – Endpoint GET Funcional
* **Objetivo:** Realizar una solicitud GET al endpoint de la API y mostrar la respuesta HTTP 200 OK.
* **URL:** `http://127.0.0.1:8000/api/flights/`
* **Que evidenciar:** Postman o navegador en Ubuntu mostrando el codigo de estado `200 OK` y el JSON retornado.

---

### Captura 19 – Endpoint POST Funcional
* **Objetivo:** Insertar un nuevo registro enviando un JSON en el cuerpo de la peticion.
* **URL:** `http://127.0.0.1:8000/api/gates/` (Metodo `POST`)
* **Body (JSON):**
  ```json
  {
    "code": "G-200",
    "terminal": "Terminal Internacional",
    "is_available": true
  }
  ```
* **Que evidenciar:** Respuesta de Postman mostrando `201 Created` y el objeto creado con su `id`.

---

# SECCION 4: FRONTEND – REACTJS

### Captura 20 – Proyecto React en Ejecucion
* **Objetivo:** Terminal de Ubuntu con el servidor de desarrollo activo.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  cd aiport-ui
  npm run dev
  ```
* **Que evidenciar:** Salida de Vite mostrando `Local: http://localhost:5173/`.

---

### Captura 21 – Listado de Registros
* **Objetivo:** Mostrar la interfaz web en el navegador de Ubuntu consumiendo la API backend.
* **URL en el navegador:** `http://localhost:5173/`
* **Que evidenciar:** La pagina web con la lista de datos consumidos desde Django.

---

### Captura 22 – Registro Nuevo Desde la Interfaz
* **Objetivo:** Crear un nuevo registro desde el formulario web y verificar su aparicion en la lista.
* **Que evidenciar:** El formulario con datos completados y la lista actualizada con el nuevo registro.

---

# SECCION 5: APLICACION MOVIL – REACT NATIVE

### Captura 23 – Proyecto Movil Creado
* **Objetivo:** Terminal de Ubuntu con el proyecto Expo iniciado.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  cd airport-rn
  npm start
  ```
* **Que evidenciar:** Consola de Metro Bundler/Expo mostrando la aplicacion inicializada.

---

### Captura 24 – Aplicacion Ejecutandose
* **Objetivo:** Pantalla principal de la aplicacion movil en ejecucion.
* **Que evidenciar:** La interfaz de la aplicacion movil renderizada en pantalla.

---

### Captura 25 – Consumo de API NoSQL
* **Objetivo:** Mostrar la pantalla de la app movil consumiendo los datos provenientes de MongoDB.
* **Que evidenciar:** Lista de eventos de vuelos (`flight_events`) visible en la aplicacion movil.

---

# SECCION 6: SISTEMAS OPERATIVOS – UBUNTU (MAQUINA VIRTUAL)

### Captura 26 – Creacion de Estructura de Directorios
* **Objetivo:** Crear la estructura de directorios con mkdir y verificarla con tree.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  mkdir -p examen/{backend,frontend,database,logs}
  tree examen/
  ```
* **Que evidenciar:** El arbol de directorios resultante del comando `tree`.

---

### Captura 27 – Navegacion y Listado
* **Objetivo:** Demostrar el uso de cd, pwd y ls -la.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  cd examen/
  pwd
  ls -la
  ```
* **Que evidenciar:** La ruta de `pwd` (/home/usuario/examen) y el detalle de archivos y permisos en `ls -la`.

---

### Captura 28 – Redireccion de Salida
* **Objetivo:** Usar redirecciones > y >> con comandos basicos.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  echo "--- INICIO DE REPORTE ---" > reporte.txt
  date >> reporte.txt
  echo "Sistema comprobado correctamente." >> reporte.txt
  cat reporte.txt
  ```
* **Que evidenciar:** El contenido del archivo `reporte.txt` desplegado con `cat`.

---

### Captura 29 – Busqueda con grep
* **Objetivo:** Realizar la busqueda de texto dentro de un archivo.
* **Comando en la terminal de Ubuntu:**
  ```bash
  grep -i "comprobado" reporte.txt
  ```
* **Que evidenciar:** La linea con el texto hallado por `grep`.

---

### Captura 30 – Permisos y Sticky Bit
* **Objetivo:** Modificar permisos con chmod y asignar el Sticky Bit a un directorio.
* **Comandos en la terminal de Ubuntu:**
  ```bash
  chmod 755 reporte.txt
  sudo mkdir /tmp/compartido
  sudo chmod 1777 /tmp/compartido
  ls -l reporte.txt
  ls -ld /tmp/compartido
  ```
* **Que evidenciar:** Los permisos `-rwxr-xr-x` para `reporte.txt` y `drwxrwxrwt` para `/tmp/compartido`.
