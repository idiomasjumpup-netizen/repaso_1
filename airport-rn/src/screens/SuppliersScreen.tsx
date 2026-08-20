import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { fetchSuppliers, createSupplier } from "../api/bakeryApi";
import { Supplier } from "../types/bakery";

export default function SuppliersScreen() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [country, setCountry] = useState<string>("Ecuador");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la API de MongoDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) {
      Alert.alert("Campos requeridos", "Por favor ingrese el nombre y el código.");
      return;
    }
    try {
      await createSupplier({ name, code, country });
      Alert.alert("Éxito", "Proveedor registrado en MongoDB correctamente.");
      setModalVisible(false);
      setName("");
      setCode("");
      loadData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const renderItem = ({ item }: { item: Supplier }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.supplierName}>{item.name}</Text>
        <View style={[styles.codeBadge, { backgroundColor: item.is_active ? "#dcfce7" : "#f3f4f6" }]}>
          <Text style={[styles.codeText, { color: item.is_active ? "#166534" : "#6b7280" }]}>
            {item.code}
          </Text>
        </View>
      </View>

      <Text style={styles.countryText}>País: {item.country || "Ecuador"}</Text>
      <Text style={styles.statusText}>
        Estado: {item.is_active ? "Activo" : "Inactivo"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Proveedores (MongoDB)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#d97706" />
          <Text style={styles.loadingText}>Cargando proveedores desde Mongo...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={suppliers}
          keyExtractor={(item) => item.id || item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay proveedores registrados en MongoDB.</Text>
          }
        />
      )}

      {/* Modal Nuevo Proveedor */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Proveedor (MongoDB)</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre (ej. Harinera San Luis)"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Código (ej. HAR)"
              value={code}
              onChangeText={setCode}
            />
            <TextInput
              style={styles.input}
              placeholder="País (ej. Ecuador)"
              value={country}
              onChangeText={setCountry}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleCreate}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf9",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  addButton: {
    backgroundColor: "#d97706",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    marginBottom: 6,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#292524",
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  countryText: {
    color: "#57534e",
    fontSize: 14,
  },
  statusText: {
    color: "#78716c",
    fontSize: 12,
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#78350f",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#e7e5e4",
  },
  cancelButtonText: {
    color: "#44403c",
  },
  saveButton: {
    backgroundColor: "#d97706",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
