// @ts-nocheck
// =========================================================
// BASE DE DATOS II – MongoDB (rental_logs)
// Examen Complexivo Práctico: Caso Alquiler de Vehículos
// Comandos a ejecutar en mongosh
// =========================================================

// 1. Seleccionar la base de datos rental_logs
use rental_logs;

// 2. Crear usuario mongo_backend_user con contraseña exa_2026_ute
db.createUser({
  user: "mongo_backend_user",
  pwd: "exa_2026_ute",
  roles: [{ role: "readWrite", db: "rental_logs" }]
});

// 3. Insertar datos de prueba en la colección customers
db.customers.insertMany([
  {
    name: "Juan Carlos López",
    license_number: "LIC-123456",
    country: "Ecuador",
    is_active: true,
    created_at: new Date()
  },
  {
    name: "María Fernanda Silva",
    license_number: "LIC-789012",
    country: "Ecuador",
    is_active: true,
    created_at: new Date()
  }
]);

// 4. Insertar datos de prueba en la colección inspection_reports
db.inspection_reports.insertOne({
  reservation_id: NumberLong(1),
  mileage_km: 15000,
  fuel_level: "FULL",
  damages: "ninguno",
  inspector_name: "Inspector Técnico",
  created_at: new Date()
});

// 5. Crear índice en inspection_reports(reservation_id)
db.inspection_reports.createIndex({ reservation_id: 1 });

// Evidenciar los índices creados
db.inspection_reports.getIndexes();

// 6. Consulta 1: Buscar actas de inspección por reservation_id
db.inspection_reports.find({ reservation_id: NumberLong(1) });

// 7. Consulta 2: Buscar actas de inspección por rango de fechas (created_at)
db.inspection_reports.find({
  created_at: {
    $gte: ISODate("2026-01-01T00:00:00Z"),
    $lte: ISODate("2026-12-31T23:59:59Z")
  }
});
