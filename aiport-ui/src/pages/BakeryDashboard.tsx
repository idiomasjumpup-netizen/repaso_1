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
  BakeryDining as BakeryIcon,
  ShoppingBag as OrderIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  LocalFireDepartment as BakingIcon,
  DoneAll as ReadyIcon,
  LocalShipping as DeliveredIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import {
  getProducts,
  createProduct,
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../api/bakery.api";
import type { Product, Order } from "../api/bakery.api";

export default function BakeryDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  // States for products and orders
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Loading & error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product Form state
  const [openProductModal, setOpenProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("PAN");
  const [newProdAvailable] = useState(true);

  // Order Form state
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [ovenBatch, setOvenBatch] = useState("LOTE-A");
  const [temperature, setTemperature] = useState(180);
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsData, ordersData] = await Promise.all([getProducts(), getOrders()]);
      setProducts(prodsData);
      setOrders(ordersData);
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    try {
      await createProduct({
        name: newProdName,
        category: newProdCategory,
        is_available: newProdAvailable,
      });
      setToastMessage("¡Producto creado exitosamente!");
      setOpenProductModal(false);
      setNewProdName("");
      fetchData();
    } catch (err: any) {
      alert("Error al crear producto: " + (err?.response?.data?.name?.[0] || err.message));
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !customerName.trim()) return;

    try {
      await createOrder({
        product: Number(selectedProductId),
        customer_name: customerName,
        oven_batch: ovenBatch,
        temperature_c: Number(temperature),
        notes: notes,
      });
      setToastMessage("¡Pedido creado y Hoja de Horneado generada en MongoDB!");
      setOpenOrderModal(false);
      setCustomerName("");
      setSelectedProductId("");
      fetchData();
    } catch (err: any) {
      alert("Error al crear el pedido: " + (err?.response?.data?.detail || err.message));
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setToastMessage(`Estado del pedido #${orderId} actualizado a ${newStatus}`);
      fetchData();
    } catch (err: any) {
      alert("Error al actualizar el estado: " + err.message);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return <Chip icon={<OrderIcon />} label="Recibido" color="info" size="small" />;
      case "BAKING":
        return <Chip icon={<BakingIcon />} label="Horneando" color="warning" size="small" />;
      case "READY":
        return <Chip icon={<ReadyIcon />} label="Listo" color="success" size="small" />;
      case "DELIVERED":
        return <Chip icon={<DeliveredIcon />} label="Entregado" color="secondary" size="small" />;
      case "CANCELLED":
        return <Chip icon={<CancelIcon />} label="Cancelado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ bgcolor: "#fdfbf7", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Banner de Cabecera */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <BakeryIcon sx={{ fontSize: 44, color: "#fef3c7" }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Sistema de Gestión - Panadería San Gabriel
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Examen Complexivo Práctico: PostgreSQL (Products/Orders) & MongoDB (Baking Sheets)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ bgcolor: "#78350f", "&:hover": { bgcolor: "#451a03" } }}
          >
            Actualizar Datos
          </Button>
        </Paper>

        {/* Tarjetas de Estadísticas Rápidas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid sx={{ width: { xs: "100%", sm: "33.33%" } }}>
            <Card elevation={2} sx={{ borderRadius: 2, borderLeft: "6px solid #d97706" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Productos Registrados
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#b45309" }}>
                  {products.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sx={{ width: { xs: "100%", sm: "33.33%" } }}>
            <Card elevation={2} sx={{ borderRadius: 2, borderLeft: "6px solid #0284c7" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Pedidos Registrados
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#0369a1" }}>
                  {orders.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sx={{ width: { xs: "100%", sm: "33.33%" } }}>
            <Card elevation={2} sx={{ borderRadius: 2, borderLeft: "6px solid #16a34a" }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Pedidos Pendientes (RECEIVED/BAKING)
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#15803d" }}>
                  {orders.filter((o) => o.status === "RECEIVED" || o.status === "BAKING").length}
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
              "& .MuiTabs-indicator": { backgroundColor: "#d97706" },
              "& .MuiTab-root.Mui-selected": { color: "#d97706", fontWeight: "bold" },
            }}
          >
            <Tab icon={<BakeryIcon />} label="Productos de Panadería (SQL)" />
            <Tab icon={<OrderIcon />} label="Pedidos y Horneado (SQL + NoSQL)" />
          </Tabs>
        </Paper>

        {/* Alerta de Carga / Error */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="warning" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* TAB 1: PRODUCTOS */}
        {!loading && tabIndex === 0 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lista de Productos (Tabla SQL: products)
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenProductModal(true)}
                sx={{ bgcolor: "#d97706", "&:hover": { bgcolor: "#b45309" } }}
              >
                Nuevo Producto
              </Button>
            </Box>

            <Grid container spacing={3}>
              {products.map((p) => (
                <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" } }} key={p.id}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {p.name}
                        </Typography>
                        <Chip
                          label={p.category}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Registrado: {new Date(p.created_at).toLocaleDateString("es-EC")}
                      </Typography>
                      <Chip
                        label={p.is_available ? "Disponible" : "Agotado"}
                        color={p.is_available ? "success" : "default"}
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {products.length === 0 && (
                <Grid sx={{ width: "100%" }}>
                  <Alert severity="info">No hay productos registrados en la base de datos.</Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* TAB 2: PEDIDOS */}
        {!loading && tabIndex === 1 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Lista de Pedidos (Tabla SQL: orders)
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenOrderModal(true)}
                sx={{ bgcolor: "#d97706", "&:hover": { bgcolor: "#b45309" } }}
              >
                Nuevo Pedido
              </Button>
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#fef3c7" }}>
                  <TableRow>
                    <TableCell><b>ID Pedido</b></TableCell>
                    <TableCell><b>Cliente</b></TableCell>
                    <TableCell><b>Producto</b></TableCell>
                    <TableCell><b>Categoría</b></TableCell>
                    <TableCell><b>Estado</b></TableCell>
                    <TableCell><b>Fecha Pedido</b></TableCell>
                    <TableCell align="center"><b>Cambiar Estado</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id} hover>
                      <TableCell>#{o.id}</TableCell>
                      <TableCell><b>{o.customer_name}</b></TableCell>
                      <TableCell>{o.product_name || `Producto #${o.product}`}</TableCell>
                      <TableCell>
                        <Chip label={o.product_category || "PAN"} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{getStatusChip(o.status)}</TableCell>
                      <TableCell>
                        {new Date(o.order_time || o.created_at).toLocaleString("es-EC")}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          select
                          size="small"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          sx={{ minWidth: 130 }}
                        >
                          <MenuItem value="RECEIVED">RECEIVED</MenuItem>
                          <MenuItem value="BAKING">BAKING</MenuItem>
                          <MenuItem value="READY">READY</MenuItem>
                          <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                          <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                        </TextField>
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No hay pedidos registrados en la base de datos.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* MODAL NUEVO PRODUCTO */}
        <Dialog open={openProductModal} onClose={() => setOpenProductModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreateProduct}>
            <DialogTitle>Registrar Nuevo Producto</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                <TextField
                  label="Nombre del Producto"
                  fullWidth
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="ej. Pan de Dulce"
                />
                <TextField
                  label="Categoría"
                  select
                  fullWidth
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                >
                  <MenuItem value="PAN">PAN</MenuItem>
                  <MenuItem value="PASTEL">PASTEL</MenuItem>
                  <MenuItem value="GALLETA">GALLETA</MenuItem>
                  <MenuItem value="OTRO">OTRO</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProductModal(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" color="warning">
                Guardar Producto
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* MODAL NUEVO PEDIDO */}
        <Dialog open={openOrderModal} onClose={() => setOpenOrderModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreateOrder}>
            <DialogTitle>Registrar Nuevo Pedido (SQL + NoSQL)</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                <TextField
                  label="Nombre del Cliente"
                  fullWidth
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ej. Carlos Mendoza"
                />
                <TextField
                  label="Producto"
                  select
                  fullWidth
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="subtitle2" sx={{ color: "#d97706", mt: 1, fontWeight: "bold" }}>
                  Configuración de Hoja de Horneado (MongoDB: baking_sheets):
                </Typography>
                <TextField
                  label="Lote de Horno (oven_batch)"
                  fullWidth
                  value={ovenBatch}
                  onChange={(e) => setOvenBatch(e.target.value)}
                  placeholder="ej. LOTE-A"
                />
                <TextField
                  label="Temperatura °C"
                  type="number"
                  fullWidth
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                />
                <TextField
                  label="Notas de Horneado"
                  fullWidth
                  multiline
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre tiempo o dorado de corteza"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenOrderModal(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" color="warning">
                Crear Pedido e Integrar Mongo
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
