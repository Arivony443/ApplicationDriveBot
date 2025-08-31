  import React, { useState } from 'react';
  import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
  import Slider from '@react-native-community/slider';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import { useTheme } from '../context/ThemeContext';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
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

    const handlePressIn = (direction: string) => {
      setActiveDirection(direction);
      onStartMove(direction);
    };

    const handlePressOut = () => {
      setActiveDirection(null);
      onStopMove();
    };

    // Fonction pour déterminer si un bouton est actif
    const isActive = (direction: string) => {
      return activeDirection === direction;
    };
    const { theme, toggleTheme ,colors} = useTheme();
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

    return (
      <View style={[styles.container,theme === 'light' ? styles.lightTheme : styles.darkTheme]}>
        {/* Bouton de thème en haut à droite */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Icon 
            name={theme === 'dark' ? 'wb-sunny' : 'nights-stay'} 
            size={24} 
            color={theme === 'dark' ? 'white' : 'black'} 
          />
        </TouchableOpacity>
        {/* Bouton de retour */}
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.button }]} onPress={onGoHome}>
    <Icon name="arrow-back" size={24} color={colors.buttonText} />
    <Text style={[styles.backText, { color: colors.buttonText }]}>Retour</Text>
  </TouchableOpacity>

        {/* Statut de connexion */}
        <Text style={[styles.statusText, { color: connectionStatus}]}>Connexion: {connectionStatus}</Text>

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
                isActive(btn.direction) && styles.activeButton
              ]}
              onPressIn={() => handlePressIn(btn.direction)}
              onPressOut={handlePressOut}
            >
              <Icon name={btn.icon} size={28} color={colors.buttonText} />
            </TouchableOpacity>
          ))}

          {/* Bouton STOP */}
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
          {activeDirection && (
  <Text style={[styles.activeCommandText, { color: colors.secondary }]}>
    Commande en cours : {formatDirection(activeDirection)}
  </Text>
)}
        </View>

        {/* Contrôle de vitesse */}
        <View style={styles.speedContainer}>
          <Text style={[styles.speedText,{color:colors.text}]}>Vitesse: {speed}</Text>
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
    darkTheme: {
      backgroundColor: '#2E2E2E',  // Fond sombre (défaut)
    },
    lightTheme: {
      backgroundColor: '#F5F5F5',  // Fond clair
    },
    themeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      padding: 10,
      zIndex: 10,  // Pour être au-dessus des autres éléments
    },
    
    statusText: {
      fontSize: 18,
      marginBottom: 15,
      fontWeight: 'bold',
      color: '#4CAF50',
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#444444',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 5,
    },
    backText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
    },
    controlCircle: {
      width: 270,
      height: 270,
      borderRadius: 135,
      backgroundColor: '#3A3A3A',
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
    stopButton: {
      backgroundColor: '#F44336',
      width: 80,
      height: 80,
      borderRadius: 40,
      shadowColor: '#F44336',
      shadowOpacity: 0.7,
      shadowRadius: 15,
    },
    controlButton: {
      backgroundColor: '#4CAF50',
    },
    activeButton: {
      backgroundColor: '#2E7D32',
      shadowColor: '#2E7D32',
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    top: { top: 10, left: '50%', marginLeft: -27.5 },
    bottom: { bottom: 10, left: '50%', marginLeft: -27.5 },
    left: { left: 10, top: '50%', marginTop: -27.5 },
    right: { right: 10, top: '50%', marginTop: -27.5 },
    topLeft: { top: 35, left: 35 },
    topRight: { top: 35, right: 35 },
    bottomLeft: { bottom: 35, left: 35 },
    bottomRight: { bottom: 35, right: 35 },
    speedContainer: {
      marginTop: 30,
      alignItems: 'center',
    },
    speedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 8,
  },
    slider: {
      width: 250,
      height: 40,
    },
  activeCommandText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 20,
},

  });

  export default CarControlUI;