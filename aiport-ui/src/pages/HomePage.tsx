import { Container, Paper, Typography, Stack } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
          <DirectionsCarIcon />
          <Typography variant="h5">Examen Frontend — Flights UI</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          SPA React + TypeScript + MUI + Router. Consume la API del examen (DRF paginado).
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Lista (público) → Login → Admin (Panel) → CRUD Gates / Flights.
        </Typography>
      </Paper>
    </Container>
  );
}