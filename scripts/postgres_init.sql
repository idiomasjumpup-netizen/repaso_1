-- =========================================================
-- BASE DE DATOS I – PostgreSQL (rental_db)
-- Examen Complexivo Práctico: Caso Alquiler de Vehículos
-- =========================================================

-- 1. Crear la base de datos rental_db
CREATE DATABASE rental_db;

-- 2. Crear el usuario backend_user con contraseña segura
CREATE USER backend_user WITH PASSWORD 'admin123';

-- 3. Asignar permisos mínimos para migraciones Django
GRANT ALL PRIVILEGES ON DATABASE rental_db TO backend_user;
\c rental_db
ALTER SCHEMA public OWNER TO backend_user;
GRANT ALL ON SCHEMA public TO backend_user;

-- 4. Verificar desde psql la conexión (\c rental_db)
-- \l
-- \dt

-- 5. Tablas creadas por Django migrations: vehicles y reservations
-- Estructura de la tabla vehicles:
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGSERIAL PRIMARY KEY,
    plate VARCHAR(10) NOT NULL UNIQUE, -- ej: 'PBA-1234'
    type VARCHAR(20) NOT NULL, -- ej: 'SEDAN', 'SUV', 'CAMIONETA'
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Estructura de la tabla reservations:
CREATE TABLE IF NOT EXISTS reservations (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    renter_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RESERVED', -- RESERVED, IN_PROGRESS, COMPLETED, DELAYED, CANCELLED
    pickup_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Crear índice b-tree en reservations(status) y demostrar uso
CREATE INDEX idx_reservations_status ON reservations(status);

-- Demostración EXPLAIN:
-- EXPLAIN SELECT * FROM reservations WHERE status = 'RESERVED';

-- 7. Crear vista vw_active_reservations (reservas en estado RESERVED / IN_PROGRESS)
CREATE OR REPLACE VIEW vw_active_reservations AS
SELECT 
    r.id AS reservation_id,
    r.renter_name,
    v.plate AS vehicle_plate,
    v.type AS vehicle_type,
    r.status,
    r.pickup_time,
    r.created_at
FROM reservations r
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.status IN ('RESERVED', 'IN_PROGRESS');

-- 8. Trigger / Función de Validación en PostgreSQL
CREATE OR REPLACE FUNCTION check_pickup_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pickup_time > NEW.created_at + INTERVAL '7 days' THEN
        RAISE EXCEPTION 'La fecha de retiro pickup_time no puede superar 7 días desde la creación de la reserva';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_check_pickup_time
BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION check_pickup_time();

-- Función adicional: Contar total de reservas por estado
CREATE OR REPLACE FUNCTION fn_total_reservations_by_status(p_status VARCHAR)
RETURNS BIGINT AS $$
DECLARE
    total BIGINT;
BEGIN
    SELECT COUNT(*) INTO total FROM reservations WHERE status = p_status;
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Datos de prueba iniciales
INSERT INTO vehicles (plate, type, is_available, created_at)
VALUES 
('PBA-1234', 'SEDAN', true, NOW()),
('PBB-5678', 'SUV', true, NOW()),
('PBC-9012', 'CAMIONETA', true, NOW())
ON CONFLICT (plate) DO NOTHING;

INSERT INTO reservations (vehicle_id, renter_name, status, pickup_time, created_at)
VALUES 
(1, 'Carlos Mendoza', 'RESERVED', NOW(), NOW()),
(2, 'Ana Gómez', 'IN_PROGRESS', NOW(), NOW())
ON CONFLICT DO NOTHING;
