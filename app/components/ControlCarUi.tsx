import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

interface CarControlUIProps {
  speed: number;
  connectionStatus: string;
  onSpeedChange: (newSpeed: number) => void;
  onStartMove: (direction: string) => void;
  onStopMove: () => void;
  onGoHome: () => void;
}

const CarControlUI: React.FC<CarControlUIProps> = ({
  speed,
  connectionStatus,
  onSpeedChange,
  onStartMove,
  onStopMove,
  onGoHome,
}) => {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const { theme, toggleTheme, colors } = useTheme();

  const handlePressIn = (direction: string) => {
    setActiveDirection(direction);
    onStartMove(direction);
  };

  const handlePressOut = () => {
    setActiveDirection(null);
    onStopMove();
  };

  const isActive = (direction: string) => activeDirection === direction;

  const formatDirection = (direction: string) => {
    switch (direction) {
      case 'avance': return 'Avancer';
      case 'recule': return 'Reculer';
      case 'gauche': return 'Tourner à gauche';
      case 'droite': return 'Tourner à droite';
      case 'avancedroite': return 'Avancer à droite';
      case 'avancegauche': return 'Avancer à gauche';
      case 'reculedroite': return 'Reculer à droite';
      case 'reculegauche': return 'Reculer à gauche';
      default: return direction;
    }
  };

  const isConnected = connectionStatus === 'green';

  const statusBackgroundColor = isConnected
    ? (theme === 'dark' ? '#2E7D32' : '#C8E6C9')
    : (theme === 'dark' ? '#B00020' : '#FFCDD2');

  const statusTextColor = isConnected
    ? (theme === 'dark' ? '#A5D6A7' : '#2E7D32')
    : (theme === 'dark' ? '#FF8A80' : '#C62828');

  return (
    <View style={[styles.container, theme === 'light' ? styles.lightTheme : styles.darkTheme]}>
      
      {/* Bouton Thème */}
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Icon
          name={theme === 'dark' ? 'wb-sunny' : 'nights-stay'}
          size={24}
          color={theme === 'dark' ? 'white' : 'black'}
        />
      </TouchableOpacity>

      {/* Bouton Retour */}
      <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.button }]} onPress={onGoHome}>
        <Icon name="arrow-back" size={24} color={colors.buttonText} />
        <Text style={[styles.backText, { color: colors.buttonText }]}>Retour</Text>
      </TouchableOpacity>

      {/* Titre */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Icon name="directions-car" size={36} color={colors.text} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text }}>Contrôle du Robot</Text>
      </View>

      {/* Cercle de contrôle */}
      <View style={[styles.controlCircle, { backgroundColor: colors.primary }]}>
        {[
          { direction: 'avance', icon: 'arrow-upward', style: styles.top },
          { direction: 'avancedroite', icon: 'north-west', style: styles.topLeft },
          { direction: 'avancegauche', icon: 'north-east', style: styles.topRight },
          { direction: 'gauche', icon: 'arrow-back', style: styles.left },
          { direction: 'droite', icon: 'arrow-forward', style: styles.right },
          { direction: 'reculegauche', icon: 'south-west', style: styles.bottomLeft },
          { direction: 'reculedroite', icon: 'south-east', style: styles.bottomRight },
          { direction: 'recule', icon: 'arrow-downward', style: styles.bottom },
        ].map((btn) => (
          <TouchableOpacity
            key={btn.direction}
            style={[
              styles.button,
              styles.controlButton,
              btn.style,
              isActive(btn.direction) && {
                ...styles.activeButton,
                transform: [{ scale: 1.1 }],
              }
            ]}
            onPressIn={() => handlePressIn(btn.direction)}
            onPressOut={handlePressOut}
          >
            <Icon name={btn.icon} size={28} color={colors.buttonText} />
          </TouchableOpacity>
        ))}

        {/* STOP */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.stopButton,
            { backgroundColor: colors.secondary }
          ]}
          onPressIn={handlePressOut}
        >
          <Icon name="stop-circle" size={40} color={colors.buttonText} />
        </TouchableOpacity>

        {/* Commande active */}
       
      </View>

      {/* Vitesse */}
      <View style={styles.speedContainer}>
        <Text style={[styles.speedText, { color: colors.text }]}>Vitesse: {speed}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={speed}
          onValueChange={onSpeedChange}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1EB1FC"
        />
      </View>

      {/* Badge de Connexion */}
      <View style={styles.statusBadgeContainer}>
        <Text style={[
          styles.statusText,
          {
            backgroundColor: statusBackgroundColor,
            color: statusTextColor,
            borderColor: statusTextColor,
            borderWidth: 1.2,
          },
        ]}>
          {connectionStatus}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
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
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusBadgeContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  controlCircle: {
    width: 270,
    height: 270,
    borderRadius: 135,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    position: 'relative',
  },
  button: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    position: 'absolute',
  },
  controlButton: { backgroundColor: '#4CAF50' },
  activeButton: {
    backgroundColor: '#2E7D32',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  stopButton: {
    backgroundColor: '#F44336',
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  top: { top: 10, left: '50%', marginLeft: -27.5 },
  bottom: { bottom: 10, left: '50%', marginLeft: -27.5 },
  left: { left: 10, top: '50%', marginTop: -27.5 },
  right: { right: 10, top: '50%', marginTop: -27.5 },
  topLeft: { top: 35, left: 35 },
  topRight: { top: 35, right: 35 },
  bottomLeft: { bottom: 35, left: 35 },
  bottomRight: { bottom: 35, right: 35 },
  activeCommandText: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  speedContainer: { marginTop: 30, alignItems: 'center' },
  speedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 8,
  },
  slider: { width: 250, height: 40 },
});

export default CarControlUI;
