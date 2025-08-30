import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Mode({ title, description, image, link }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(link);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#003B66',
        borderRadius: 18,
        marginVertical: 12,
        width: 340,
        maxWidth: '95%',
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 7,
      }}
    >
      {/* Image à gauche */}
      <Image
        source={image}
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
          marginRight: 15,
          backgroundColor: '#fff',
          padding: 5,
        }}
        resizeMode="contain"
      />

      {/* Texte + bouton */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: '#dcdcdc', marginBottom: 10 }}>
          {description}
        </Text>

        <TouchableOpacity
          onPress={handlePress}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#fff',
            paddingVertical: 6,
            paddingHorizontal: 15,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#003B66', fontWeight: 'bold' }}>Lancer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
