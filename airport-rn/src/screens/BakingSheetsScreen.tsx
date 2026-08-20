import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { fetchBakingSheets } from "../api/bakeryApi";
import { BakingSheet } from "../types/bakery";

export default function BakingSheetsScreen() {
  const [bakingSheets, setBakingSheets] = useState<BakingSheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOrderId, setFilterOrderId] = useState<string>("");

  const loadData = async (orderIdStr?: string) => {
    setLoading(true);
    setError(null);
    try {
      const orderIdNum = orderIdStr ? parseInt(orderIdStr, 10) : undefined;
      const data = await fetchBakingSheets(isNaN(orderIdNum!) ? undefined : orderIdNum);
      setBakingSheets(data);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la API de MongoDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    loadData(filterOrderId);
  };

  const handleClearFilter = () => {
    setFilterOrderId("");
    loadData("");
  };

  const renderItem = ({ item }: { item: BakingSheet }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderTitle}>Pedido SQL ID: #{item.order_id}</Text>
        <View style={styles.batchBadge}>
          <Text style={styles.batchText}>{item.oven_batch || "LOTE-A"}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Temperatura:</Text>
        <Text style={styles.infoValue}>{item.temperature_c ?? 180} °C</Text>
      </View>

      {item.estimated_ready_at && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hora estimada:</Text>
          <Text style={styles.infoValue}>
            {new Date(item.estimated_ready_at).toLocaleTimeString("es-EC")}
          </Text>
        </View>
      )}

      {item.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesText}>📝 {item.notes}</Text>
        </View>
      )}

      <Text style={styles.dateText}>
        Registrado: {new Date(item.created_at || Date.now()).toLocaleString("es-EC")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Hojas de Horneado (MongoDB)</Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar por order_id (ej. 1)"
          keyboardType="numeric"
          value={filterOrderId}
          onChangeText={setFilterOrderId}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {filterOrderId.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#b45309" />
          <Text style={styles.loadingText}>Cargando hojas de horneado...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadData(filterOrderId)}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={bakingSheets}
          keyExtractor={(item) => item.id || String(item.order_id) + Math.random()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No se encontraron hojas de horneado en MongoDB.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf9",
  },
  topBar: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#78350f",
  },
  filterBar: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#f5f5f4",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#b45309",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#e7e5e4",
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#57534e",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#292524",
  },
  batchBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  batchText: {
    color: "#b45309",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: {
    color: "#78716c",
    fontSize: 14,
  },
  infoValue: {
    fontWeight: "600",
    color: "#44403c",
    fontSize: 14,
  },
  notesBox: {
    backgroundColor: "#fffbe8",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  notesText: {
    color: "#92400e",
    fontSize: 13,
  },
  dateText: {
    color: "#a8a29e",
    fontSize: 11,
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#78350f",
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#78350f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#78716c",
    marginTop: 40,
  },
});
