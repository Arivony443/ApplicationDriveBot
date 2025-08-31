import React, { useEffect, useState } from 'react';
import { stopAllModes } from './utilis/robotControl';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { getStoredIP } from './Setting';

export default function Autonome() {
  const [ip, setIp] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [etatRobot, setEtatRobot] = useState('En attente...');
  const [modeAutonomeActif, setModeAutonomeActif] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function checkConnection() {
      const storedIp = await getStoredIP();
      if (!storedIp) {
        Alert.alert('Erreur', 'Aucune IP enregistrée dans les paramètres');
        setLoading(false);
        return;
      }
      setIp(storedIp);

      try {
        const response = await fetch(`http://${storedIp}/status`);
        if (response.ok) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.log('Erreur connexion ESP32 (autonome):', error);
        setConnected(false);
      }
      setLoading(false);
    }

    // première tentative immédiate
    checkConnection();

    // vérifie toutes les 5 secondes
    interval = setInterval(() => {
      console.log('Nouvelle tentative de connexion...');
      checkConnection();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    return () => {
      if (ip) stopAllModes(ip); // ← Appel de la fonction
    };
  }, [ip]);

  // Récupération de l'état du robot
  const fetchEtatRobot = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/etat`);
      if (response.ok) {
        const etat = await response.text();
        setEtatRobot(etat);

        // Mettre à jour l'état du mode autonome selon l'état du robot
        if (etat.includes('autonome') || etat.includes('Autonome')) {
          setModeAutonomeActif(true);
        } else {
          setModeAutonomeActif(false);
        }
      }
    } catch (err) {
      console.log('Erreur récupération état robot:', err);
    }
  };

  // Activer le mode autonome
  const activerAutonome = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/autonome`);
      if (response.ok) {
        setModeAutonomeActif(true);
        fetchEtatRobot(); // Mettre à jour l'état
        Alert.alert('Succès', 'Mode autonome activé !');
      } else {
        Alert.alert('Erreur', "Impossible d'activer le mode autonome");
      }
    } catch (err) {
      console.log('Erreur activation mode autonome:', err);
      Alert.alert('Erreur', 'Connexion perdue');
    }
  };

  // Arrêter le mode autonome
  const arreterAutonome = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/stopauto`);
      if (response.ok) {
        setModeAutonomeActif(false);
        fetchEtatRobot(); // Mettre à jour l'état
        Alert.alert('Succès', 'Mode autonome arrêté !');
      } else {
        Alert.alert('Erreur', "Impossible d'arrêter le mode autonome");
      }
    } catch (err) {
      console.log('Erreur arrêt mode autonome:', err);
      Alert.alert('Erreur', 'Connexion perdue');
    }
  };

  // Mise à jour de l'état en temps réel
  useEffect(() => {
    if (!ip || !connected) return;

    const interval = setInterval(() => {
      fetchEtatRobot();
    }, 1000); // Mise à jour toutes les secondes

    return () => clearInterval(interval);
  }, [ip, connected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mode Autonome</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00e6e6" />
      ) : connected ? (
        <View style={styles.statusContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>État Robot :</Text>
              <Text style={[styles.infoValue, { color: '#00e6e6' }]}>
                {etatRobot}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mode Autonome :</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: modeAutonomeActif ? '#00e676' : '#ff9800',
                    fontWeight: 'bold',
                  },
                ]}
              >
                {modeAutonomeActif ? 'ACTIF' : 'INACTIF'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Connexion :</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: '#00e676', fontWeight: 'bold' },
                ]}
              >
                CONNECTÉ
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IP :</Text>
              <Text style={[styles.infoValue, { color: '#00e6e6' }]}>{ip}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.activateButton]}
              onPress={activerAutonome}
              disabled={modeAutonomeActif}
            >
              <Text style={styles.buttonText}>ACTIVER MODE AUTONOME</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={arreterAutonome}
              disabled={!modeAutonomeActif}
            >
              <Text style={styles.buttonText}>ARRÊTER MODE AUTONOME</Text>
            </TouchableOpacity>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: '#012F4E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#00e6e6',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%',
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  activateButton: {
    backgroundColor: '#00e676',
  },
  stopButton: {
    backgroundColor: '#ff5252',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  connected: {
    color: '#00ff00',
    fontSize: 24,
    fontWeight: 'bold',
  },
  disconnected: {
    color: '#ff3333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ip: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
  },
});
