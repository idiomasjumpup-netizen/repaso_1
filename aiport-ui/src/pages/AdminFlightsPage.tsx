import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesAdminApi } from "../api/gates.api";
import { type Flight, listFlightsAdminApi, createFlightApi, updateFlightApi, deleteFlightApi, type Status } from "../api/flights.api";

export default function AdminFlightsPage() {
  const [items, setItems] = useState<Flight[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [gate, setGate] = useState<number>(0);
  const [flight_number, setFlightNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState<Status>("agendado");


  const load = async () => {
    try {
      setError("");
      const data = await listFlightsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadGates = async () => {
    try {
      const data = await listGatesAdminApi();
      setGates(data.results); // DRF paginado
      if (!gate && data.results.length > 0) setGate(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadGates(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!gate) return setError("Seleccione una gate");
      if (!flight_number.trim() || !status.trim()) return setError("NUmero de vuelo y status son requeridos");

      const payload = {
        gate: Number(gate),
        flight_number: flight_number.trim(),
        destination: destination,
        status:status as Status,
      };

      if (editId) await updateFlightApi(editId, payload);
      else await createFlightApi(payload as any);

      setEditId(null);
      setFlightNumber("");
      setDestination("");
      setStatus("agendado");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Flight) => {
    setEditId(v.id);
    setGate(v.gate);
    setFlightNumber(v.flight_number );
    setDestination(v.destination);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteFlightApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="gate-label">Gate</InputLabel>
              <Select
                labelId="gate-label"
                label="Gate"
                value={gate}
                onChange={(e) => setGate(Number(e.target.value))}
              >
                {gates.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.code} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="FLight Number" value={flight_number} onChange={(e) => setFlightNumber(e.target.value)} fullWidth />
            <TextField label="Destino" value={destination} onChange={(e) => setDestination(e.target.value)} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                    labelId="estado-label"
                    label="Estado"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                >
                    <MenuItem value="agendado">Agendado</MenuItem>
                    <MenuItem value="a_bordo">A bordo</MenuItem>
                    <MenuItem value="despegado">Despegado</MenuItem>
                    <MenuItem value="retrasado">Retrasado</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
            </FormControl>

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setFlightNumber(""); setStatus("agendado"); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadGates(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>gate_nombre</TableCell>
              <TableCell>flight_number</TableCell>
              <TableCell>destination</TableCell>
              <TableCell>status</TableCell>
              <TableCell>created_at</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.gate_nombre ?? v.gate}</TableCell>
                <TableCell>{v.flight_number}</TableCell>
                <TableCell>{v.destination}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>{v.created_at}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}