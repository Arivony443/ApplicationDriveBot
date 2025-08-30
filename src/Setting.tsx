import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App'; // ← adapte le chemin selon ton dossier

export const IP_STORAGE_KEY = 'APP_IP_ADDRESS';

// Fonction pour récupérer l'IP stockée
export async function getStoredIP() {
  return await AsyncStorage.getItem(IP_STORAGE_KEY);
}

// Fonction pour sauvegarder l'IP
export async function setStoredIP(ip: string) {
  await AsyncStorage.setItem(IP_STORAGE_KEY, ip);
}

export default function Setting() {
  const [ip, setIp] = useState('');

  // useNavigation correctement typé
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    getStoredIP().then(storedIp => {
      if (storedIp) setIp(storedIp);
    });
  }, []);

  const handleSave = async () => {
    const trimmedIp = ip.trim();

    if (!trimmedIp) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse IP.');
      return;
    }

    // Regex pour IPv4 + option port
    const ipPortRegex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}(:\d{1,5})?$/;

    if (!ipPortRegex.test(trimmedIp)) {
      Alert.alert('Erreur', 'Adresse IP ou port invalide (ex: 192.168.1.100:3000).');
      return;
    }

    await setStoredIP(trimmedIp);
    Alert.alert('Succès', 'Adresse IP enregistrée !');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>
      <Text style={styles.label}>Adresse IP du serveur :</Text>
      <TextInput
        style={styles.input}
        value={ip}
        onChangeText={setIp}
        placeholder="ex: 192.168.1.100:3000"
        keyboardType="default"
        autoCapitalize="none"
      />
      <Button title="Enregistrer" onPress={handleSave} color="#00bcd4" />

      <TouchableOpacity
        style={styles.aboutBtn}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.aboutText}>À propos du projet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#012F4E' },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 32 },
  label: { color: '#fff', fontSize: 18, marginBottom: 8 },
  input: {
    width: 260,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 18,
    marginBottom: 16,
    color: '#222',
  },
  aboutBtn: {
    marginTop: 40,
    padding: 12,
    backgroundColor: '#00bcd4',
    borderRadius: 8,
  },
  aboutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
