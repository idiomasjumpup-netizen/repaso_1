import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panadería San Gabriel</Text>
        <Text style={styles.subtitle}>App Móvil - Módulo NoSQL (MongoDB)</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#d97706" }]}
          onPress={() => navigation.navigate("Suppliers")}
        >
          <Text style={styles.cardIcon}>🚚</Text>
          <Text style={styles.cardTitle}>Proveedores</Text>
          <Text style={styles.cardSubtitle}>Colección suppliers en MongoDB</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#b45309" }]}
          onPress={() => navigation.navigate("BakingSheets")}
        >
          <Text style={styles.cardIcon}>🥖</Text>
          <Text style={styles.cardTitle}>Hojas de Horneado</Text>
          <Text style={styles.cardSubtitle}>Colección baking_sheets en MongoDB</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Examen Complexivo Práctico - React Native</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbe8",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#78350f",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#92400e",
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#fef3c7",
    marginTop: 4,
  },
  footer: {
    alignItems: "center",
    marginBottom: 10,
  },
  footerText: {
    color: "#b45309",
    fontSize: 12,
  },
});