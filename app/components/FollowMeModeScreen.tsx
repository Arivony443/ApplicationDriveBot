import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

interface FollowMeModeScreenProps {
  onGoHome: () => void;
  connectionStatus: string;
  ipAddress: string;
}

const FollowMeModeScreen: React.FC<FollowMeModeScreenProps> = ({ onGoHome, connectionStatus, ipAddress }) => {
  const [status, setStatus] = useState('En attente...');
  const { theme, colors } = useTheme();
  const isConnected = connectionStatus === 'Connecté';
  const [loading, setLoading] = useState(false);

  const startFollowMe = async () => {
    if (!isConnected) {
      Alert.alert('Erreur', 'Le robot n\'est pas connecté.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://${ipAddress}/follow-me`);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const msg = await response.text();
      setStatus(msg || 'Mode "Follow me" activé.');
    } catch (err) {
      setStatus('Erreur de communication avec le robot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatus('En attente...');
  }, [ipAddress, connectionStatus]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Icon name="account-arrow-right" size={60} color={colors.text} style={{ marginBottom: 20 }} />
      <Text style={[styles.title, { color: colors.text }]}>Mode "Follow me"</Text>
      <Text style={[styles.status, { color: colors.text }]}>{status}</Text>
      <TouchableOpacity onPress={startFollowMe} style={[styles.button, { backgroundColor: colors.primary }]} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.buttonText} />
        ) : (
          <>
            <Icon name="play" size={22} color={colors.buttonText} />
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Démarrer le suivi</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoHome} style={[styles.button, { backgroundColor: colors.button, marginTop: 16 }]}> 
        <Icon name="arrow-left" size={22} color={colors.buttonText} />
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>Retour</Text>
      </TouchableOpacity>
      <View style={styles.statusBadgeContainer}>
        <Text style={[
          styles.statusBadge,
          {
            backgroundColor: isConnected ? '#C8E6C9' : '#FFCDD2',
            color: isConnected ? '#2E7D32' : '#C62828',
            borderColor: isConnected ? '#2E7D32' : '#C62828',
            borderWidth: 1.2,
          }
        ]}>
          Connexion : {connectionStatus}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusBadgeContainer: {
    marginTop: 32,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 16,
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default FollowMeModeScreen;
