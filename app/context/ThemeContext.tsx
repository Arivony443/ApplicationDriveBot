import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  button: string;
  buttonText: string;
};

const lightColors: ThemeColors = {
  primary: '#F5F5F5',    // Fond général doux, presque blanc cassé
  secondary: '#E0E0E0',  // Gris clair pour les éléments secondaires
  background: '#FFFFFF', // Blanc pur pour les zones centrales
  text: '#1A1A1A',       // Texte noir doux, très lisible
  button: '#E5E5E5',     // Bouton gris clair élégant
  buttonText: '#2E2E2E', // Texte légèrement foncé pour le contraste
};

const darkColors: ThemeColors = {
  primary: '#1A1A1A',    // Noir profond, mais pas totalement pur (moins agressif)
  secondary: '#2A2A2A',  // Gris très foncé pour les zones secondaires
  background: '#121212', // Fond général standard du vrai dark mode
  text: '#FFFFFF',       // Gris clair pour un bon contraste sans aveugler
  button: '#2E2E2E',     // Gris sombre uniforme pour les boutons
  buttonText: 'white', // Texte blanc-gris clair pour rester doux mais lisible
};

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors; 
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: darkColors, // Valeur par défaut
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Appearance.getColorScheme() || 'dark');
  const colors = theme === 'dark' ? darkColors : lightColors;

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}> {/* Ajoute colors ici */}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);