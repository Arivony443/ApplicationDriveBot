// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../context/ThemeContext';

// interface Props {
//   onGoHome: () => void;
//   connectionStatus: string;
//   ipAddress: string;
// }

// const AutoModeScreen: React.FC<Props> = ({ onGoHome, connectionStatus ,ipAddress}) => {
//   const [status, setStatus] = useState('Chargement...');
//   const { colors } = useTheme();
//   const isConnected = connectionStatus === 'green';

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetch(`http://${ipAddress}/etat`)
//         .then((res) => res.text())
//         .then((msg) => setStatus(msg))
//         .catch(() => setStatus('❌ Erreur de communication avec le robot'));
//     }, 0.5);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>

//       {/* Icône principale robot */}
//       <Icon name="robot" size={60} color={colors.text} style={{ marginBottom: 20 }} />

//       <Text style={[styles.title, { color: colors.text }]}>Mode automatique activé</Text>

//       <Text style={[styles.status, { color: colors.text }]}>
//         {status === 'Chargement...' ? <ActivityIndicator size="small" color={colors.primary} /> : status}
//       </Text>

//       <TouchableOpacity onPress={onGoHome} style={[styles.button, { backgroundColor: colors.primary }]}>
//         <Icon name="arrow-left" size={22} color={colors.buttonText} />
//         <Text style={[styles.buttonText, { color: colors.buttonText }]}>Retour</Text>
//       </TouchableOpacity>

//       {/* Badge Connexion */}
//       <View style={styles.statusBadgeContainer}>
//         <Text style={[
//           styles.statusBadge,
//           {
//             backgroundColor: isConnected ? '#C8E6C9' : '#FFCDD2',
//             color: isConnected ? '#2E7D32' : '#C62828',
//             borderColor: isConnected ? '#2E7D32' : '#C62828',
//             borderWidth: 1.2,
//           }
//         ]}>
//           Connexion : {connectionStatus}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 14,
//   },
//   status: {
//     fontSize: 18,
//     marginVertical: 40,
//     textAlign: 'center',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 30,
//     elevation: 4,
//   },
//   buttonText: {
//     marginLeft: 10,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   statusBadgeContainer: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//   },
//   statusBadge: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
// });

// export default AutoModeScreen;

// /*server.on("/status", []() {
//   server.send(200, "text/plain", etatRobot); // etatRobot = chaîne actuelle de décision
// });
// */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onGoHome: () => void;
  connectionStatus: string;
  ipAddress: string;
}

const AutoModeScreen: React.FC<Props> = ({ onGoHome, connectionStatus, ipAddress }) => {
  const [status, setStatus] = useState('Chargement...');
  const { colors } = useTheme();
  const isConnected = connectionStatus === 'green';

  useEffect(() => {
    const interval = setInterval(() => {
      const formattedIP = ipAddress.replace(/^https?:\/\//, '');
      fetch(`http://${formattedIP}/etat`)
        .then((res) => res.text())
        .then((msg) => setStatus(msg))
        .catch(() => setStatus('❌ Erreur de communication avec le robot'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sélection de l’icône selon l’état
  const getStatusIcon = () => {
    if (status.includes('avance')) return 'arrow-up-bold';
    if (status.includes('recule')) return 'arrow-down-bold';
    if (status.includes('gauche')) return 'arrow-left-bold';
    if (status.includes('droite')) return 'arrow-right-bold';
    if (status.includes('Obstacle')) return 'alert';
    if (status.includes('Erreur')) return 'close-circle-outline';
    return 'robot';
  };
const getIconColor = () => {
  if (status.includes('avance')) return '#4CAF50'; // vert
  if (status.includes('recule')) return '#2196F3'; // bleu
  if (status.includes('gauche') || status.includes('droite')) return '#FFC107'; // jaune
  if (status.includes('Obstacle')) return '#F44336'; // rouge
  if (status.includes('Erreur')) return '#9E9E9E'; // gris
  return colors.primary; // couleur par défaut (du thème)
};
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Icon name={getStatusIcon()} size={70} color={getIconColor()} style={{ marginBottom: 25 }} /> 

      <Text style={[styles.title, { color: colors.text }]}>Mode automatique activé</Text>

      <Text style={[styles.status, { color: colors.text }]}>
        
      </Text>

      <TouchableOpacity onPress={onGoHome} style={[styles.button, { backgroundColor: colors.primary }]}>
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 20,
    marginVertical: 30,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadgeContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  statusBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default AutoModeScreen;