import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import Mode from './Mode';

export default function Home() {
  return (
    <LinearGradient
      colors={['#012F4E', '#004466', '#383838ff']}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 24,
          paddingHorizontal: 0,
          alignItems: 'center',
        }}
      >
        <Mode
          title="Commande"
          description="Vous pouvez guider le robot"
          image={require('../assets/icones/Manuel.webp')}
          link="Manuel"
        />
        <Mode
          title="Autonome"
          description="Le robot peut naviguer dans un environnement"
          image={require('../assets/icones/Autonome.png')}
          link="Autonome"
        />
        <Mode
          title="Suiveur de main"
          description="Le robot suit les déplacements d'une main"
          image={require('../assets/icones/Suiveur.webp')}
          link="SuiveurMain"
        />
        
        
      </ScrollView>
    </LinearGradient>
  );
}
