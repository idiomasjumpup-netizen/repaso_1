import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesAdminApi, createGateApi, updateGateApi, deleteGateApi } from "../api/gates.api";

export default function AdminGatesPage() {
  const [items, setItems] = useState<Gate[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [terminal, setTerminal] = useState("");
  const [is_available, setIsAvailable] = useState(true);

  const loadGates = async () => {
    try {
      setError("");
      const data = await listGatesAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => {loadGates(); }, []);

  const save = async () => {
    try {
      setError("");

      const payload = {
        code: code.trim(),
        terminal:terminal,
        is_available: is_available,
      };

      if (editId) await updateGateApi(editId, payload);
      else await createGateApi(payload as any);

      setEditId(null);
      setCode("");
      setTerminal("");
      setIsAvailable(true);

      await loadGates();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Gate) => {
    setEditId(v.id);
    setCode(v.code);
    setTerminal(v.terminal);
    setIsAvailable(v.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteGateApi(id);
      await loadGates();
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


            <TextField label="Modelo" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={terminal} onChange={(e) => setTerminal(e.target.value)} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControlLabel
                control={
                <Checkbox checked={is_available} onChange={(e) => setIsAvailable(e.target.checked)} />
                }
                label="Disponible"
            />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setCode(""); setIsAvailable(true);}}>Limpiar</Button>
            <Button variant="outlined" onClick={() => {loadGates(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>code</TableCell>
              <TableCell>terminal</TableCell>
              <TableCell>is_available</TableCell>
              <TableCell>created_at</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.code}</TableCell>
                <TableCell>{v.terminal}</TableCell>
                <TableCell>{v.is_available ? "Sí" : "No"}</TableCell>
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