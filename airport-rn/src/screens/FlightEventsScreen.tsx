import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listFlightsApi } from "../api/flights.api";
import { listAirlinesApi } from "../api/airlines.api";
import { listFlightEventsApi, createFlightEventApi, deleteFlightEventApi } from "../api/FlightEvents.api";

import type { Flight } from "../types/flight";
import type { Airline } from "../types/airline";
import type { EventType, FlightEvent, Source } from "../types/flightEvent";
import { toArray } from "../types/drf";
import RadioGroup from "../components/RadioGroup";


function airlineLabel(st: Airline): string {
  return st.name;
}


export default function FlightEventsScreen() {
  const [services, setServices] = useState<FlightEvent[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);

  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [selectedAirlineId, setSelectedAirlineId] = useState<string>("");
 
  const [event_type, setEventType] = useState<EventType>("creado");
  const [source, setSource] = useState<Source>("web");
  const [note, setNote] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [servicesData, flightsData, airlinesData] = await Promise.all([
        listFlightEventsApi(),
        listFlightsApi(),
        listAirlinesApi(),
      ]);

      const servicesList = toArray(servicesData);
      const flightsList = toArray(flightsData);
      const airlinesList = toArray(airlinesData);

      setServices(servicesList);
      setFlights(flightsList);
      setAirlines(airlinesList);

      if (selectedFlightId === null && flightsList.length) setSelectedFlightId(flightsList[0].id);
      if (!selectedAirlineId && airlinesList.length) setSelectedAirlineId(airlinesList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedFlightId === null) return setErrorMessage("Seleccione un vuelo");
      if (!selectedAirlineId) return setErrorMessage("Seleccione una aerolínea");

      const trimmedNotes = note.trim() ? note.trim() : undefined;


      // NO enviar fecha, backend la toma actual
      const created = await createFlightEventApi({
        flight_id: selectedFlightId,
        airline_id: selectedAirlineId,
        event_type: event_type,
        source: source,
        note: trimmedNotes,

      });

      setServices((prev) => [created, ...prev]);
      setEventType("creado")
      setSource("web")
      setNote("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteFlightEventApi(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>FLight Events</Text>
            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <Text style={styles.label}>Flight (flight_number )</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedFlightId ?? ""}
                onValueChange={(value) => setSelectedFlightId(Number(value))}
                dropdownIconColor="#58a6ff"
                style={styles.picker}
              >
                {flights.map((v) => (
                  <Picker.Item key={v.id} label={v.flight_number} value={v.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Tipo de servicio</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedAirlineId}
                onValueChange={(value) => setSelectedAirlineId(String(value))}
                dropdownIconColor="#58a6ff"
                style={styles.picker}
              >
                {airlines.map((st) => (
                  <Picker.Item key={st.id} label={airlineLabel(st)} value={st.id} />
                ))}
              </Picker>
            </View>
            <RadioGroup<EventType>
              label="eVENT TYPE"
              value={event_type}
              onChange={setEventType}
              options={[
                { label: "creado", value: "creado" },
                { label: "a_bordo", value: "a_bordo" },
                { label: "despegado", value: "despegado" },
                { label: "retrasado", value: "retrasado" },
                { label: "cancelado", value: "cancelado" },
              ]}
            />

            <RadioGroup<Source>
              label="Source"
              value={source}
              onChange={setSource}
              options={[
                { label: "web", value: "web" },
                { label: "mobile", value: "mobile" },
                { label: "sistema", value: "sistema" },
              ]}
            />

            <Text style={styles.label}>Notas (opcional)</Text>
            <TextInput
              placeholder="Notas"
              placeholderTextColor="#8b949e"
              value={note}
              onChangeText={setNote}
              style={styles.input}
            />



            <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
            </Pressable>

            <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Refrescar</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>Flight ID: {item.flight_id}</Text>
              <Text style={styles.rowSub} numberOfLines={1}>Service Type ID: {item.airline_id}</Text>
              {<Text style={styles.rowSub} numberOfLines={1}>Event Type: {item.event_type}</Text>}
              {<Text style={styles.rowSub} numberOfLines={1}>Source: {item.source}</Text>}
              {!!item.note && <Text style={styles.rowSub} numberOfLines={1}>Notas: {item.note}</Text>}
              {!!item.created_at && <Text style={styles.rowSub} numberOfLines={1}>Fecha: {item.created_at}</Text>}
            </View>

            <Pressable onPress={() => removeService(item.id)}>
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

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

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
  del: { color: "#ff7b72", fontWeight: "800" },
});