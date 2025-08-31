
import React, { useState, useEffect } from 'react';
import { View, Alert ,TouchableOpacity,Text} from 'react-native';
import HomeScreen from './components/HomeScreen';
import CarControlUI from './components/ControlCarUi';
import { ThemeProvider } from './context/ThemeContext';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import AutoModeScreen from './components/AutoModeScreen';
import FollowMeModeScreen from './components/FollowMeModeScreen';


const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [mode, setMode] = useState<'manual' | 'auto' | 'follow' | null>(null);
  const [speed, setSpeed] = useState(50);
  const [connectionStatus, setConnectionStatus] = useState("Déconnecté");
  const [ipAddress, setIpAddress]  = useState('192.168.121.133'); // valeur par défaut


  const checkConnection = async () => {
    try {
      const response = await fetch(`http://${ipAddress}/ping`);
      setConnectionStatus(response.ok ? "Connecté" : "Déconnecté");
    } catch (error) {
      setConnectionStatus("Déconnecté");
    }
  };

  useEffect(() => {
  checkConnection(); // Vérifie tout de suite avec la nouvelle IP
  const interval = setInterval(checkConnection, 3000); // Continue à vérifier toutes les 3s
  return () => clearInterval(interval); // Nettoie l'ancien interval
}, [ipAddress]); // 🔁 Réagit à chaque changement de l'adresse IP

  const sendCommand = async (direction: string) => {
    if (connectionStatus !== "Connecté") {
      Alert.alert('Erreur', 'Aucune connexion Wi-Fi');
      return;
    }

    try {
      const response = await fetch(`http://${ipAddress}/${direction}?speed=${speed}`);
      const result = await response.json();
      console.log("Réponse ESP8266 :", result);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
    }
  };

  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const onStartMove = (direction: string) => {
    console.log(`Déplacement : ${direction}`);
    setActiveDirection(direction);
    sendCommand(direction);
  };

  const onStopMove = () => {
    setActiveDirection(null);
    sendCommand("stop");
  };

  const onGoHome = () => {
    if (mode === 'auto') {
    fetch(`http://${ipAddress}/stopauto`)
      .then(() => console.log('Mode automatique désactivé'))
      .catch((err) => console.error('Erreur désactivation auto:', err));
  }
  setMode(null);
  //setHasStarted(false);
  };

const onSelectMode = (selectedMode: 'manual' | 'auto' | 'follow') => {
  setMode(selectedMode);

  if (selectedMode === 'auto') {
    // Envoyer une requête pour activer l’ultrason
    fetch(`http://${ipAddress}/autonome`)
      .then(() => console.log('Mode automatique activé'))
      .catch((err) => console.error('Erreur activation auto:', err));
  }
  // Pour 'follow', la requête est envoyée dans l'écran dédié
};

  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
      {!hasStarted ? (
        <HomeScreen onStart={() => setHasStarted(true)} />
  ) : !mode ? (
        <ModeSelectionScreen 
        onSelectMode={onSelectMode} 
        onExit={() => setHasStarted(false)} 
        connectionStatus={connectionStatus}
        setIpAddress={setIpAddress}
        ipAddress={ipAddress}/>

      ) : mode === 'manual' ? (
        <CarControlUI
          speed={speed}
          connectionStatus={connectionStatus}
          onSpeedChange={setSpeed}
          onStartMove={onStartMove}
          onStopMove={onStopMove}
          onGoHome={onGoHome}

        />
  ) : mode === 'follow' ? (
        <FollowMeModeScreen
          onGoHome={onGoHome}
          connectionStatus={connectionStatus}
          ipAddress={ipAddress}
        />
      ) : (
          <AutoModeScreen
           onGoHome={onGoHome}
           connectionStatus={connectionStatus}
            ipAddress={ipAddress}
          />
      )}
    </View>
    </ThemeProvider>
  );
};

export default App;
