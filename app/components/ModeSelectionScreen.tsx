import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onSelectMode: (mode: 'manual' | 'auto' | 'follow') => void;
  connectionStatus: string;
  onExit: () => void;
  setIpAddress: (ip: string) => void;
  ipAddress: string;
}

const ModeSelectionScreen: React.FC<Props> = ({
  onSelectMode,
  onExit,
  connectionStatus,
  setIpAddress,
  ipAddress,
}) => {
  const { theme, toggleTheme, colors } = useTheme();
  const isConnected = connectionStatus === 'green';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bouton quitter */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.exitButton, { backgroundColor: colors.primary }]}
          onPress={onExit}
        >
          <Icon name="close" size={26} color={colors.buttonText} />
        </TouchableOpacity>

        {/* Bouton thème */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.themeButton]}
          onPress={toggleTheme}
        >
          <Icon
            name={theme === 'dark' ? 'wb-sunny' : 'nights-stay'}
            size={26}
            color={colors.text}
          />
        </TouchableOpacity>

        {/* Zone haute avec logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/ispmlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Contenu principal */}
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.text }]}>Adresse IP du robot :</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text }]}
            placeholder="192.168.188.63"
            placeholderTextColor={colors.text + '80'}
            value={ipAddress}
            onChangeText={setIpAddress}
          />

          <MCIcon
            name="robot-industrial"
            size={64}
            color={colors.text}
            style={{ marginBottom: 20 }}
          />

          <Text style={[styles.title, { color: colors.text }]}>
            Choisissez le mode de contrôle
          </Text>

          <TouchableOpacity
            style={[styles.bigButton, { backgroundColor: colors.primary }]}
            onPress={() => onSelectMode('manual')}
            activeOpacity={0.85}
          >
            <Icon name="sports-esports" size={30} color={colors.buttonText} />
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Contrôle manuel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bigButton, { backgroundColor: colors.primary }]}
            onPress={() => onSelectMode('auto')}
            activeOpacity={0.85}
          >
            <MCIcon name="robot" size={30} color={colors.buttonText} />
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Mode automatique
            </Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={[styles.bigButton, { backgroundColor: colors.primary }]}
            onPress={() => onSelectMode('follow')}
            activeOpacity={0.85}
          >
            <MCIcon name="account-arrow-right" size={30} color={colors.buttonText} />
            <Text style={[styles.buttonText, { color: colors.buttonText }]}> 
              Mode Follow me
            </Text>
          </TouchableOpacity>
        </View>

        {/* Badge connexion */}
        <View style={styles.statusBadgeContainer}>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: isConnected ? '#C8E6C9' : '#FFCDD2',
                color: isConnected ? '#2E7D32' : '#C62828',
                borderColor: isConnected ? '#2E7D32' : '#C62828',
                borderWidth: 1.2,
              },
            ]}
          >
            Connexion : {connectionStatus}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginTop:50,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  bigButton: {
    width: width * 0.85,
    paddingVertical: 18,
    marginVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '700',
  },
  floatingButton: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  exitButton: {
    top: 30,
    left: 30,
  },
  themeButton: {
    top: 30,
    right: 30,
  },
  statusBadgeContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ModeSelectionScreen;
