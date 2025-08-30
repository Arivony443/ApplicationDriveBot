import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { getStoredIP } from './Setting';

const size = 220;
const stickSize = 60;
const radius = (size - stickSize) / 2;

function getDirection(x: number, y: number): string {
  const dist = Math.sqrt(x * x + y * y);
  if (dist < 20) return 'centre';
  const angle = (Math.atan2(y, x) * 180) / Math.PI;

  if (angle >= -22.5 && angle < 22.5) return 'droite';
  if (angle >= 22.5 && angle < 67.5) return 'bas-droite';
  if (angle >= 67.5 && angle < 112.5) return 'bas';
  if (angle >= 112.5 && angle < 157.5) return 'bas-gauche';
  if (angle >= 157.5 || angle < -157.5) return 'gauche';
  if (angle >= -157.5 && angle < -112.5) return 'haut-gauche';
  if (angle >= -112.5 && angle < -67.5) return 'haut';
  if (angle >= -67.5 && angle < -22.5) return 'haut-droite';

  return 'centre'; // <- valeur par défaut si angle n’est pas couvert
}

export default function Manuel() {
  const [direction, setDirection] = useState('centre');
  const [vitesse, setVitesse] = useState(50);
  const [obstacle, setObstacle] = useState(false);
  const [ip, setIp] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Récupération de l'IP
  useEffect(() => {
    async function fetchIP() {
      const storedIp = await getStoredIP();
      if (!storedIp)
        Alert.alert('Erreur', 'Aucune IP configurée dans les paramètres');
      setIp(storedIp);
      if (storedIp) checkConnection(storedIp);
    }
    fetchIP();
  }, []);

  // Vérifier la connexion à l'ESP32
  const checkConnection = async (storedIp: string) => {
    try {
      const response = await fetch(`http://${storedIp}/status`);
      setConnected(response.ok);
    } catch {
      setConnected(false);
    }
  };

  // Envoi direction + vitesse
  const sendCommand = async (dir: string, speed: number) => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: dir, vitesse: speed }),
      });
      setConnected(response.ok);
    } catch (err) {
      console.log('Erreur envoi commande ESP32:', err);
      setConnected(false);
    }
  };

  // Récupération obstacle
  const fetchObstacle = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/obstacle`);
      if (response.ok) {
        const data = await response.json();
        setObstacle(data.detected);
      }
    } catch (err) {
      console.log('Erreur récupération obstacle:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchObstacle();
      if (ip) checkConnection(ip);
    }, 500);
    return () => clearInterval(interval);
  }, [ip]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let dx = gesture.dx;
        let dy = gesture.dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) {
          const angle = Math.atan2(dy, dx);
          dx = Math.cos(angle) * radius;
          dy = Math.sin(angle) * radius;
        }
        pan.setValue({ x: dx, y: dy });
        const dir = getDirection(dx, dy);
        setDirection(dir);
        sendCommand(dir, vitesse);
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        setDirection('centre');
        sendCommand('centre', vitesse);
      },
    }),
  ).current;

  // Envoi vitesse au changement
  useEffect(() => {
    sendCommand(direction, vitesse);
  }, [vitesse]);

  return (
    <LinearGradient
      colors={['#012F4E', '#004466', '#383838ff']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Commande Manuelle</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Direction :</Text>
            <Text style={[styles.infoValue, { color: '#00e6e6' }]}>
              {direction.toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vitesse :</Text>
            <Text style={[styles.infoValue, { color: '#00e6e6' }]}>
              {vitesse} %
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Obstacle :</Text>
            <Text
              style={[
                styles.infoValue,
                { color: obstacle ? '#ff5252' : '#00e676', fontWeight: 'bold' },
              ]}
            >
              {obstacle ? 'DÉTECTÉ' : 'AUCUN'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Connexion :</Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color: connected ? '#00e676' : '#ff5252',
                  fontWeight: 'bold',
                },
              ]}
            >
              {connected ? 'CONNECTÉ' : 'DÉCONNECTÉ'}
            </Text>
          </View>
        </View>

        <View style={styles.analogContainer}>
          <Animated.View
            style={[
              styles.stick,
              { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
            ]}
            {...panResponder.panHandlers}
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Vitesse</Text>
          <Slider
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={vitesse}
            onValueChange={setVitesse}
            minimumTrackTintColor="#00e6e6"
            maximumTrackTintColor="#004466"
            thumbTintColor="#00e6e6"
            style={{ height: 40 }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingTop: 32,
  },
  title: { fontSize: 36, color: 'white', fontWeight: 'bold', marginBottom: 24 },
  analogContainer: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  stick: {
    position: 'absolute',
    left: size / 2 - stickSize / 2,
    top: size / 2 - stickSize / 2,
    width: stickSize,
    height: stickSize,
    borderRadius: stickSize / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#bbb',
    elevation: 4,
  },
  infoCard: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    alignSelf: 'center',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: { color: '#fff', fontSize: 18, fontWeight: '600' },
  infoValue: { fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  sliderContainer: { width: 300, marginTop: 50, alignItems: 'stretch' },
  sliderLabel: {
    color: '#00e6e6',
    fontSize: 21,
    marginBottom: 4,
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
