import { useEffect, useState } from "react";
import RadioGroup from "../components/RadioGroup";
import CheckboxRow from "../components/CheckboxRow";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listAirlinesApi, createAirlineApi, deleteAirlineApi } from "../api/airlines.api";
import type { Airline } from "../types/airline";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function AirlinesScreen() {
  const [items, setItems] = useState<Airline[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");
  const [is_active, setIsActive] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listAirlinesApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar service types. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanName = normalizeText(name);
      if (!cleanName) return setErrorMessage("Name es requerido");

      const created = await createAirlineApi({
        name: cleanName,
        code: code,
        country: country,
        is_active: is_active,
      });

      setItems((prev) => [created, ...prev]);
      setName("");
      setCode("");
      setCountry("");
      setIsActive(true)
    } catch {
      setErrorMessage("No se pudo crear service type.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteAirlineApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar service type.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Service Types</Text>
            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Pepito"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />

            <Text style={styles.label}>Code (opcional)</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="12433saasd"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />
            <Text style={styles.label}>PAIS</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Ecuador"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />
            <CheckboxRow
              label="Disponible"
              checked={is_active}
              onChange={setIsActive}
            />

            <Pressable onPress={createItem} style={styles.btn}>
              <Text style={styles.btnText}>Crear</Text>
            </Pressable>

            <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Refrescar</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>Nombre: {item.name}</Text>
              <Text style={styles.rowText} numberOfLines={1}>Código: {item.code}</Text>
              <Text style={styles.rowText} numberOfLines={1}>País: {item.country}</Text>
              <Text style={styles.rowText} numberOfLines={1}>
                Disponible: {item.is_active ? "Sí" : "No"}
              </Text>
              <Text style={styles.rowText} numberOfLines={1}>Fecha: {item.created_at}</Text>
            
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  list: { flex: 1 },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "700" },
});