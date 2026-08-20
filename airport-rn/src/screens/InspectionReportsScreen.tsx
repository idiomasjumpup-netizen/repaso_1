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
import { fetchInspectionReports } from "../api/rentalApi";
import { InspectionReport } from "../types/rental";

export default function InspectionReportsScreen() {
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterReservationId, setFilterReservationId] = useState<string>("");

  const loadData = async (resIdStr?: string) => {
    setLoading(true);
    setError(null);
    try {
      const resIdNum = resIdStr ? parseInt(resIdStr, 10) : undefined;
      const data = await fetchInspectionReports(isNaN(resIdNum!) ? undefined : resIdNum);
      setReports(data);
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
    loadData(filterReservationId);
  };

  const handleClearFilter = () => {
    setFilterReservationId("");
    loadData("");
  };

  const renderItem = ({ item }: { item: InspectionReport }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.resTitle}>Reserva SQL ID: #{item.reservation_id}</Text>
        <View style={styles.fuelBadge}>
          <Text style={styles.fuelText}>⛽ {item.fuel_level || "FULL"}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Kilometraje:</Text>
        <Text style={styles.infoValue}>{item.mileage_km ?? 15000} km</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Inspector:</Text>
        <Text style={styles.infoValue}>{item.inspector_name || "Técnico"}</Text>
      </View>

      {item.damages && (
        <View style={styles.damagesBox}>
          <Text style={styles.damagesText}>🔧 Daños: {item.damages}</Text>
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
        <Text style={styles.headerTitle}>Actas de Inspección (MongoDB)</Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar por reservation_id (ej. 1)"
          keyboardType="numeric"
          value={filterReservationId}
          onChangeText={setFilterReservationId}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {filterReservationId.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Cargando actas de inspección...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadData(filterReservationId)}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id || String(item.reservation_id) + Math.random()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No se encontraron actas de inspección en MongoDB.
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
    backgroundColor: "#f8fafc",
  },
  topBar: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  filterBar: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#f1f5f9",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#0284c7",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#475569",
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
    borderColor: "#e2e8f0",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  fuelBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fuelText: {
    color: "#0369a1",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: {
    color: "#64748b",
    fontSize: 14,
  },
  infoValue: {
    fontWeight: "600",
    color: "#334155",
    fontSize: 14,
  },
  damagesBox: {
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  damagesText: {
    color: "#b91c1c",
    fontSize: 13,
  },
  dateText: {
    color: "#94a3b8",
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
    color: "#0f172a",
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#0f172a",
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
    color: "#64748b",
    marginTop: 40,
  },
});
