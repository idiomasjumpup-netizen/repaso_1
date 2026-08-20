import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
} from "@mui/material";
import {
  DirectionsCar as VehicleIcon,
  EventNote as ReservationIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  DirectionsCarFilled as InProgressIcon,
  CheckCircle as CompletedIcon,
  AccessTime as DelayedIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import {
  getVehicles,
  createVehicle,
  getReservations,
  createReservation,
  updateReservationStatus,
} from "../api/rental.api";
import type { Vehicle, Reservation } from "../api/rental.api";

export default function RentalDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  // States for vehicles and reservations
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Loading & error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vehicle Form state
  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newType, setNewType] = useState("SEDAN");

  // Reservation Form state
  const [openReservationModal, setOpenReservationModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");
  const [renterName, setRenterName] = useState("");
  const [mileageKm, setMileageKm] = useState(15000);
  const [fuelLevel, setFuelLevel] = useState("FULL");
  const [damages, setDamages] = useState("ninguno");
  const [inspectorName, setInspectorName] = useState("Inspector Técnico");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vehiclesData, reservationsData] = await Promise.all([
        getVehicles(),
        getReservations(),
      ]);
      setVehicles(vehiclesData);
      setReservations(reservationsData);
    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setError(
        err?.response?.data?.detail ||
          "Error al conectar con la API del Backend Django (PostgreSQL/MongoDB). Verifique que el servidor esté activo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    try {
      await createVehicle({
        plate: newPlate,
        type: newType,
        is_available: true,
      });
      setToastMessage("¡Vehículo registrado exitosamente!");
      setOpenVehicleModal(false);
      setNewPlate("");
      fetchData();
    } catch (err: any) {
      alert("Error al registrar vehículo: " + (err?.response?.data?.plate?.[0] || err.message));
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !renterName.trim()) return;

    try {
      await createReservation({
        vehicle: Number(selectedVehicleId),
        renter_name: renterName,
        mileage_km: Number(mileageKm),
        fuel_level: fuelLevel,
        damages: damages,
        inspector_name: inspectorName,
      });
      setToastMessage("¡Reserva creada y Acta de Inspección generada en MongoDB!");
      setOpenReservationModal(false);
      setRenterName("");
      setSelectedVehicleId("");
      fetchData();
    } catch (err: any) {
      alert("Error al crear la reserva: " + (err?.response?.data?.detail || err.message));
    }
  };

  const handleStatusChange = async (reservationId: number, newStatus: string) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      setToastMessage(`Estado de la reserva #${reservationId} actualizado a ${newStatus}`);
      fetchData();
    } catch (err: any) {
      alert("Error al actualizar el estado: " + err.message);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "RESERVED":
        return <Chip icon={<ReservationIcon />} label="Reservado" color="info" size="small" />;
      case "IN_PROGRESS":
        return <Chip icon={<InProgressIcon />} label="En Progreso" color="warning" size="small" />;
      case "COMPLETED":
        return <Chip icon={<CompletedIcon />} label="Completado" color="success" size="small" />;
      case "DELAYED":
        return <Chip icon={<DelayedIcon />} label="Retrasado" color="secondary" size="small" />;
      case "CANCELLED":
        return <Chip icon={<CancelIcon />} label="Cancelado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Banner de Cabecera */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <VehicleIcon sx={{ fontSize: 44, color: "#38bdf8" }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Sistema de Gestión - Empresa de Alquiler de Vehículos
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Examen Complexivo Práctico: PostgreSQL (Vehicles/Reservations) & MongoDB (Inspection Reports)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="info"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" } }}
          >
            Actualizar Datos
          </Button>
        </Paper>

        {/* Tarjetas de Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid sx={{ width: { xs: "100%", sm: "33.33%" } }}>
            <Card elevation={2} sx={{ borderRadius: 2, borderLeft: "6px solid #0284c7" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Vehículos Registrados
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#0369a1" }}>
                  {vehicles.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sx={{ width: { xs: "100%", sm: "33.33%" } }}>
            <Card elevation={2} sx={{ borderRadius: 2, borderLeft: "6px solid #16a34a" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Reservas Registradas
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#15803d" }}>
                  {reservations.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sx={{ width: { xs: "100%", sm: "33.33%" } }}>
            <Card elevation={2} sx={{ borderRadius: 2, borderLeft: "6px solid #d97706" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Reservas Activas (RESERVED/IN_PROGRESS)
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#b45309" }}>
                  {
                    reservations.filter(
                      (r) => r.status === "RESERVED" || r.status === "IN_PROGRESS"
                    ).length
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pestañas de Navegación */}
        <Paper elevation={1} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, val) => setTabIndex(val)}
            variant="fullWidth"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#0284c7" },
              "& .MuiTab-root.Mui-selected": { color: "#0284c7", fontWeight: "bold" },
            }}
          >
            <Tab icon={<VehicleIcon />} label="Vehículos de Alquiler (SQL)" />
            <Tab icon={<ReservationIcon />} label="Reservas y Actas (SQL + NoSQL)" />
          </Tabs>
        </Paper>

        {/* Alerta de Carga / Error */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="info" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* TAB 1: VEHÍCULOS */}
        {!loading && tabIndex === 0 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lista de Vehículos (Tabla SQL: vehicles)
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenVehicleModal(true)}
                sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" } }}
              >
                Nuevo Vehículo
              </Button>
            </Box>

            <Grid container spacing={3}>
              {vehicles.map((v) => (
                <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" } }} key={v.id}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {v.plate}
                        </Typography>
                        <Chip
                          label={v.type}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Registrado: {new Date(v.created_at).toLocaleDateString("es-EC")}
                      </Typography>
                      <Chip
                        label={v.is_available ? "Disponible" : "En Uso"}
                        color={v.is_available ? "success" : "default"}
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {vehicles.length === 0 && (
                <Grid sx={{ width: "100%" }}>
                  <Alert severity="info">No hay vehículos registrados en la base de datos.</Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* TAB 2: RESERVAS */}
        {!loading && tabIndex === 1 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lista de Reservas (Tabla SQL: reservations)
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenReservationModal(true)}
                sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" } }}
              >
                Nueva Reserva
              </Button>
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#e2e8f0" }}>
                  <TableRow>
                    <TableCell><b>ID Reserva</b></TableCell>
                    <TableCell><b>Cliente</b></TableCell>
                    <TableCell><b>Placa Vehículo</b></TableCell>
                    <TableCell><b>Tipo</b></TableCell>
                    <TableCell><b>Estado</b></TableCell>
                    <TableCell><b>Fecha Retiro</b></TableCell>
                    <TableCell align="center"><b>Cambiar Estado</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>#{r.id}</TableCell>
                      <TableCell><b>{r.renter_name}</b></TableCell>
                      <TableCell>{r.vehicle_plate || `Vehículo #${r.vehicle}`}</TableCell>
                      <TableCell>
                        <Chip label={r.vehicle_type || "SEDAN"} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{getStatusChip(r.status)}</TableCell>
                      <TableCell>
                        {new Date(r.pickup_time || r.created_at).toLocaleString("es-EC")}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          select
                          size="small"
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          sx={{ minWidth: 140 }}
                        >
                          <MenuItem value="RESERVED">RESERVED</MenuItem>
                          <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                          <MenuItem value="DELAYED">DELAYED</MenuItem>
                          <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                        </TextField>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reservations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No hay reservas registradas en la base de datos.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* MODAL NUEVO VEHÍCULO */}
        <Dialog open={openVehicleModal} onClose={() => setOpenVehicleModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreateVehicle}>
            <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                <TextField
                  label="Placa del Vehículo"
                  fullWidth
                  required
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                  placeholder="ej. PBA-1234"
                />
                <TextField
                  label="Tipo de Vehículo"
                  select
                  fullWidth
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <MenuItem value="SEDAN">SEDAN</MenuItem>
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="CAMIONETA">CAMIONETA</MenuItem>
                  <MenuItem value="HATCHBACK">HATCHBACK</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenVehicleModal(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" color="info">
                Guardar Vehículo
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* MODAL NUEVA RESERVA */}
        <Dialog open={openReservationModal} onClose={() => setOpenReservationModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreateReservation}>
            <DialogTitle>Registrar Nueva Reserva (SQL + NoSQL)</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                <TextField
                  label="Nombre del Cliente (Arrendatario)"
                  fullWidth
                  required
                  value={renterName}
                  onChange={(e) => setRenterName(e.target.value)}
                  placeholder="ej. Juan Carlos López"
                />
                <TextField
                  label="Vehículo"
                  select
                  fullWidth
                  required
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                >
                  {vehicles.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.plate} ({v.type})
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="subtitle2" sx={{ color: "#0284c7", mt: 1, fontWeight: "bold" }}>
                  Configuración de Acta de Inspección (MongoDB: inspection_reports):
                </Typography>
                <TextField
                  label="Kilometraje Actual (km)"
                  type="number"
                  fullWidth
                  value={mileageKm}
                  onChange={(e) => setMileageKm(Number(e.target.value))}
                />
                <TextField
                  label="Nivel de Combustible"
                  select
                  fullWidth
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value)}
                >
                  <MenuItem value="FULL">FULL</MenuItem>
                  <MenuItem value="3/4">3/4</MenuItem>
                  <MenuItem value="1/2">1/2</MenuItem>
                  <MenuItem value="1/4">1/4</MenuItem>
                  <MenuItem value="EMPTY">EMPTY</MenuItem>
                </TextField>
                <TextField
                  label="Daños Preexistentes"
                  fullWidth
                  multiline
                  rows={2}
                  value={damages}
                  onChange={(e) => setDamages(e.target.value)}
                  placeholder="ninguno / rayón menor en puerta frontal"
                />
                <TextField
                  label="Nombre del Inspector"
                  fullWidth
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenReservationModal(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" color="info">
                Crear Reserva e Integrar Mongo
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Toast Notificación */}
        <Snackbar
          open={!!toastMessage}
          autoHideDuration={4000}
          onClose={() => setToastMessage(null)}
          message={toastMessage}
        />
      </Container>
    </Box>
  );
}
