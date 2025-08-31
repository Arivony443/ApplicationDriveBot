import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

type PointNavScreenProps = {
  ipAddress: string;
  connectionStatus: string;
  onGoHome: () => void;
};

const PointNavScreen: React.FC<PointNavScreenProps> = ({ ipAddress, connectionStatus, onGoHome }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const [target, setTarget] = useState<{ latitude: number; longitude: number } | null>(null);
  const isConnected = connectionStatus === 'Connecté';

  const handleMapPress = (e: MapPressEvent) => {
    setTarget(e.nativeEvent.coordinate);
  };

  const sendTarget = async () => {
    if (!isConnected) {
      Alert.alert('Connexion requise', "Le robot n'est pas connecté.");
      return;
    }
    if (!target) {
      Alert.alert('Aucune cible', 'Touchez la carte pour choisir un point.');
      return;
    }
    try {
      const response = await fetch(`http://${ipAddress}/navigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: target.longitude, y: target.latitude, frame: 'map' }),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      Alert.alert('Envoyé', 'Point de destination transmis au robot.');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible denvoyer la destination.');
    }
  };

  return (
    <View style={[styles.container, theme === 'light' ? styles.lightTheme : styles.darkTheme]}> 
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Icon name={theme === 'dark' ? 'wb-sunny' : 'nights-stay'} size={24} color={theme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.button }]} onPress={onGoHome}>
        <Icon name="arrow-back" size={24} color={colors.buttonText} />
        <Text style={[styles.backText, { color: colors.buttonText }]}>Retour</Text>
      </TouchableOpacity>

      <View style={{ width: '100%', height: '65%', borderRadius: 16, overflow: 'hidden' }}>
        <MapView
          style={{ flex: 1 }}
          onPress={handleMapPress}
          initialRegion={{ latitude: -18.9, longitude: 47.5, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
        >
          {target && (
            <Marker
              coordinate={target}
              draggable
              onDragEnd={(e: any) => setTarget(e.nativeEvent.coordinate)}
            />
          )}
        </MapView>
      </View>

      <View style={{ marginTop: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.text, marginBottom: 8 }}>
          {target ? `Cible: lat ${target.latitude.toFixed(6)}, lon ${target.longitude.toFixed(6)}` : 'Touchez la carte pour choisir une cible'}
        </Text>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={sendTarget}>
          <Icon name="send" size={22} color={colors.buttonText} />
          <Text style={[styles.actionText, { color: colors.buttonText }]}>Envoyer la cible</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusBadgeContainer}>
        <Text style={[styles.statusText, { color: isConnected ? '#2E7D32' : '#C62828', borderColor: isConnected ? '#2E7D32' : '#C62828', backgroundColor: isConnected ? '#C8E6C9' : '#FFCDD2' }]}>
          Connexion : {connectionStatus}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  darkTheme: { backgroundColor: '#2E2E2E' },
  lightTheme: { backgroundColor: '#F5F5F5' },
  themeButton: { position: 'absolute', top: 20, right: 20, padding: 10, zIndex: 10 },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
  },
  backText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  actionText: { marginLeft: 8, fontSize: 16, fontWeight: '700' },
  statusBadgeContainer: { position: 'absolute', bottom: 30, alignSelf: 'center' },
  statusText: { fontSize: 16, fontWeight: 'bold', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 12, overflow: 'hidden', borderWidth: 1.2 },
});

export default PointNavScreen;


