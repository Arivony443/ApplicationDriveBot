import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HomeScreenProps {
  onStart: () => void;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, theme === 'light' ? styles.lightContainer : styles.darkContainer]}>
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Icon
          name={theme === 'dark' ? 'wb-sunny' : 'nights-stay'}
          size={24}
          color={theme === 'dark' ? 'white' : 'black'}
        />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/ispmlogo.png')}
          style={styles.logo}
        />
      </View>

      {/* Titre sans émoji */}
      <Text style={[styles.title, theme === 'light' ? styles.lightText : styles.darkText]}>
        Voiture Connectée
      </Text>

      <Text style={[styles.description, theme === 'light' ? styles.lightSecondaryText : styles.darkSecondaryText]}>
        Contrôlez votre voiture intelligente via Wi-Fi en temps réel
      </Text>

      <TouchableOpacity
        style={[styles.startButton, theme === 'light' ? styles.lightButton : styles.darkButton]}
        onPress={onStart}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Démarrer l'expérience</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Projet ISPM - DriveBot</Text>
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
  darkContainer: {
    backgroundColor: '#2E2E2E',
  },
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: -200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  themeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    color: '#1EB1FC',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#2E2E2E',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: width * 0.8,
    lineHeight: 24,
  },
  darkSecondaryText: {
    color: '#CCCCCC',
  },
  lightSecondaryText: {
    color: '#666666',
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkButton: {
    backgroundColor: '#444444',
  },
  lightButton: {
    backgroundColor: '#1EB1FC',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    color: '#888888',
    fontSize: 14,
  },
});

export default HomeScreen;
