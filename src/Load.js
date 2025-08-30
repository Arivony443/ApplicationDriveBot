import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Load({ navigation }) {

  const handleContinue = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundFill} />
      <Image source={require('../assets/images/c.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F1824',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#00bcd4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
