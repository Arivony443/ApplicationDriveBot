import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from './Header';

export default function About() {
  return (
    <View style={{ flex: 1, backgroundColor: '#012F4E' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>À propos du projet</Text>
        <Text style={styles.text}>
          Ce projet a été développé par l'équipe ISPM pour le module de robotique mobile.
          {'\n\n'}
          Il permet de contrôler un robot en mode manuel ou autonome, de visualiser les données en temps réel et de configurer l'adresse IP du serveur.
          {'\n\n'}
          Développeurs :
          {'\n'}- RAKOTOARIVONY Mihaja Johann
          {'\n'}- ADRIANARILANTO Nekena ontsa
          {'\n'}- VELOARIMANANA Laro Ny Antsa
          {'\n'}- RABESAOTRA Ryan Christino
          {'\n'}- AMBOARAFITAHINA Jesse
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>2025 ISPM - Projet Robotique Mobile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#00e6e6',
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    backgroundColor: '#012F4E',
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#00e6e6',
  },
  footerText: {
    color: '#00e6e6',
    fontSize: 15,
    fontWeight: 'bold',
  },
});