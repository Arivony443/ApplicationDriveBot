import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getStoredIP } from './Setting';

export default function Suiveur() {
  const [ip, setIp] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initConnection() {
      const storedIp = await getStoredIP();
      if (!storedIp) {
        Alert.alert('Erreur', 'Aucune IP enregistrée dans les paramètres');
        setLoading(false);
        return;
      }
      setIp(storedIp);

      try {
        // Exemple : vérifier la connexion à l'ESP32
        const response = await fetch(`http://${storedIp}/status`);
        if (response.ok) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.log('Erreur connexion ESP32:', error);
        setConnected(false);
      }
      setLoading(false);
    }

    initConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mode Suiveur</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00e6e6" />
      ) : connected ? (
        <View style={styles.statusContainer}>
          <Text style={styles.connected}>Connecté</Text>
          <Text style={styles.ip}>IP : {ip}</Text>
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <Text style={styles.disconnected}>Déconnecté</Text>
          <Text style={styles.ip}>IP : {ip || 'Aucune'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#012F4E', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, color: '#00e6e6', fontWeight: 'bold', marginBottom: 24 },
  statusContainer: { alignItems: 'center' },
  connected: { color: '#00ff00', fontSize: 24, fontWeight: 'bold' },
  disconnected: { color: '#ff3333', fontSize: 24, fontWeight: 'bold' },
  ip: { color: '#fff', fontSize: 18, marginTop: 8 },
});
