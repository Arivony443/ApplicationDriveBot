import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  // État local pour gérer le thème (clair ou sombre)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, theme === 'light' ? styles.lightContainer : styles.darkContainer]}>
      {/* Sélecteur de thème */}
      <View style={styles.themeToggleContainer}>
        <Text style={[styles.themeToggleText, theme === 'light' ? styles.lightText : styles.darkText]}>
          {theme === 'light' ? 'Thème Clair' : 'Thème Sombre'}
        </Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? '#1EB1FC' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      {/* Contenu principal */}
      <Text style={[styles.title, theme === 'light' ? styles.lightText : styles.darkText]}>
        Bienvenue sur HomeScreen !
      </Text>

      <Text style={[styles.description, theme === 'light' ? styles.lightSecondaryText : styles.darkSecondaryText]}>
        Voici la page principale de votre application.
      </Text>

      <TouchableOpacity
        style={[styles.startButton, theme === 'light' ? styles.lightButton : styles.darkButton]}
        onPress={onStart}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Commencer</Text>
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
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: width * 0.8,
  },
  darkText: {
    color: '#A0CFFF',
  },
  lightText: {
    color: '#1EB1FC',
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
