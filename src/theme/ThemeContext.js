import React, { createContext } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext({
  theme: 'light',
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const theme = systemColorScheme || 'light';

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
