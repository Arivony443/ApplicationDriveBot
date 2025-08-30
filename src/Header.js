// src/components/CustomHeader.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';

export default function Header () {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "auto",
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: '#012F4E',
  
      }}
    >
      {/* Image à gauche */}
      <Image
        source={require('../assets/images/ispm.png')}
        style={{ width: 250, height: 170}}
        resizeMode="contain"
      />

      {/* Titre */}
      <Text style={{ color: '#f5f7fc', fontSize: 19, fontWeight: 'bold', marginBottom:15}}>
        Institut Supérieur Polytechnique De Madagascar
      </Text>
      <View style={{width:200, height: 2 , backgroundColor : "white",borderRadius:10}}></View>
      
    </View>
  );
};

