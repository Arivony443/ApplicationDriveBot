import React, { useState, useEffect } from 'react';
import { stopAllModes } from './utilis/robotControl';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { getStoredIP } from './Setting';

type Direction =
  | 'haut'
  | 'bas'
  | 'gauche'
  | 'droite'
  | 'stop'
  | 'haut_droite'
  | 'haut_gauche'
  | 'bas_droite'
  | 'bas_gauche';

export default function Manuel() {
  const [ip, setIp] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [etatRobot, setEtatRobot] = useState('En attente...');
  const [vitesse, setVitesse] = useState(50);

  // Vérifie la connexion à l'ESP32
  const checkConnection = async (targetIp?: string) => {
    const ipToCheck = targetIp || ip;
    if (!ipToCheck) return;
    try {
      const response = await fetch(`http://${ipToCheck}/status`, {
        method: 'GET',
        cache: 'no-store',
      });
      setConnected(response.ok);
    } catch {
      setConnected(false);
    }
  };

  // Récupère l'IP stockée et vérifie la connexion au lancement
  useEffect(() => {
    let mounted = true;
    async function fetchIP() {
      const storedIp = await getStoredIP();
      if (!storedIp) {
        Alert.alert('Erreur', 'Aucune IP configurée dans les paramètres');
        return;
      }
      if (mounted) setIp(storedIp);
      await checkConnection(storedIp);
    }
    fetchIP();
    return () => {
      mounted = false;
    };
  }, []);

  // Vérifie la connexion toutes les 2 secondes
  useEffect(() => {
    if (!ip) return;
    const interval = setInterval(() => {
      checkConnection();
    }, 2000);
    return () => clearInterval(interval);
  }, [ip]);

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (ip) stopAllModes(ip);
    };
  }, [ip]);

  // Envoi direction + vitesse
  const sendCommand = async (dir: Direction, speed: number) => {
    if (!ip) return;
    let endpoint = '';
    switch (dir) {
      case 'haut':
        endpoint = '/avance';
        break;
      case 'bas':
        endpoint = '/recule';
        break;
      case 'gauche':
        endpoint = '/gauche';
        break;
      case 'droite':
        endpoint = '/droite';
        break;
      case 'haut_droite':
        endpoint = '/haut_droite';
        break;
      case 'haut_gauche':
        endpoint = '/haut_gauche';
        break;
      case 'bas_droite':
        endpoint = '/bas_droite';
        break;
      case 'bas_gauche':
        endpoint = '/bas_gauche';
        break;
      case 'stop':
        endpoint = '/stop';
        break;
      default:
        endpoint = '/stop';
        break;
    }
    try {
      await fetch(`http://${ip}${endpoint}?speed=${speed}`, {
        method: 'GET',
        cache: 'no-store',
      });
    } catch {
      setConnected(false);
    }
  };

  // Récupération de l'état du robot
  const fetchEtatRobot = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/etat`);
      if (response.ok) {
        const etat = await response.text();
        setEtatRobot(etat);
      }
    } catch {}
  };

  // Rafraîchit état toutes les 500ms
  useEffect(() => {
    if (!ip) return;
    const interval = setInterval(() => {
      fetchEtatRobot();
    }, 500);
    return () => clearInterval(interval);
  }, [ip]);

  // Envoi vitesse au changement
  useEffect(() => {
    sendCommand('stop', vitesse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vitesse]);

  // Boutons de direction
  const handlePress = (dir: Direction) => {
    sendCommand(dir, vitesse);
  };

  return (
    <LinearGradient
      colors={['#012F4E', '#004466', '#383838ff']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Commande Manuelle</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vitesse :</Text>
            <Text style={[styles.infoValue, { color: '#00e6e6' }]}>
              {vitesse} %
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>État robot :</Text>
            <Text style={[styles.infoValue, { color: '#00e6e6' }]}>
              {etatRobot}
            </Text>
          </View>
        </View>
        <View style={styles.buttonGrid}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('haut_gauche')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>↖</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('haut')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>▲</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('haut_droite')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>↗</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('gauche')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>◀</Text>
            </TouchableOpacity>
            <View
              style={[
                styles.button,
                { backgroundColor: 'transparent', elevation: 0 },
              ]}
            />
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('droite')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('bas_gauche')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>↙</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('bas')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPressIn={() => handlePress('bas_droite')}
              onPressOut={() => handlePress('stop')}
            >
              <Text style={styles.buttonText}>↘</Text>
            </TouchableOpacity>
          </View>
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
  buttonGrid: {
    alignItems: 'center',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00e6e6',
    borderRadius: 40,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 4,
  },
  buttonText: {
    fontSize: 36,
    color: '#012F4E',
    fontWeight: 'bold',
  },
  sliderContainer: { width: 300, marginTop: 30, alignItems: 'stretch' },
  sliderLabel: {
    color: '#00e6e6',
    fontSize: 21,
    marginBottom: 4,
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
