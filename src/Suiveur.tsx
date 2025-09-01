import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { getStoredIP } from './Setting';
import { stopAllModes } from './utilis/robotControl';

export default function Suiveur() {
  const [ip, setIp] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [etatRobot, setEtatRobot] = useState('En attente...');
  const [modeSuiveurActif, setModeSuiveurActif] = useState(false);

  //fonction pour récupérer l'état du robot
  const fetchEtatRobot = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/etat`);
      if (response.ok) {
        const etat = await response.text();
        setEtatRobot(etat);

        // Mettre à jour l'état du mode suiveur selon l'état du robot
        if (etat.includes('suiveur') || etat.includes('Suiveur')) {
          setModeSuiveurActif(true);
        } else {
          setModeSuiveurActif(false);
        }
      }
    } catch (err) {
      console.log('Erreur récupération état robot:', err);
    }
  };
  // NOUVELLE FONCTION : Activer le mode Follow Me
  const activerFollowMe = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/followme`);
      if (response.ok) {
        setModeSuiveurActif(true);
        fetchEtatRobot(); // Mettre à jour l'état
        Alert.alert('Succès', 'Mode Follow Me activé !');
      } else {
        Alert.alert('Erreur', "Impossible d'activer le mode Follow Me");
      }
    } catch (err) {
      console.log('Erreur activation mode Follow Me:', err);
      Alert.alert('Erreur', 'Connexion perdue');
    }
  };

  // NOUVELLE FONCTION : Arrêter le mode Follow Me
  const arreterFollowMe = async () => {
    if (!ip) return;
    try {
      const response = await fetch(`http://${ip}/stopFollow`,{
        method: 'GET',
        cache: 'no-store'
      });
      if (response.ok) {
        setModeSuiveurActif(false);
        fetchEtatRobot(); // Mettre à jour l'état
        Alert.alert('Succès', 'Mode Follow Me arrêté !');
      } else {
        Alert.alert('Erreur', "Impossible d'arrêter le mode Follow Me");
      }
    } catch (err) {
      console.log('Erreur arrêt mode Follow Me:', err);
      Alert.alert('Erreur', 'Connexion perdue');
    }
  };
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
  useEffect(() => {
    return () => {
      if (ip) stopAllModes(ip); // ← Appel de la fonction
    };
  }, [ip]);
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
      <Text style={styles.title}>Mode Suiveur</Text>

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
              <Text style={styles.infoLabel}>Mode Follow Me :</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color: modeSuiveurActif ? '#00e676' : '#ff9800',
                    fontWeight: 'bold',
                  },
                ]}
              >
                {modeSuiveurActif ? 'ACTIF' : 'INACTIF'}
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
              onPress={activerFollowMe}
              disabled={modeSuiveurActif}
            >
              <Text style={styles.buttonText}>ACTIVER FOLLOW ME</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={arreterFollowMe}
            >
              <Text style={styles.buttonText}>ARRÊTER FOLLOW ME</Text>
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
    paddingHorizontal: 20, // ← NOUVEAU !
  },
  title: {
    fontSize: 28,
    color: '#00e6e6',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%', // ← NOUVEAU !
  },
  // NOUVEAUX STYLES :
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
  // GARDER LES ANCIENS STYLES :
  connected: { color: '#00ff00', fontSize: 24, fontWeight: 'bold' },
  disconnected: { color: '#ff3333', fontSize: 24, fontWeight: 'bold' },
  ip: { color: '#fff', fontSize: 18, marginTop: 8 },
});
