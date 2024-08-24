// src/context/ThemeContext.js

import { createContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState(() => {
    const savedMode = localStorage.getItem('colorMode');
    return savedMode ? savedMode : 'light';
  });

  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          ...(colorMode === 'light'
            ? {
                primary: {
                  main: '#1976d2',
                },
                secondary: {
                  main: '#ff4081',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#000000',
                  secondary: '#555555',
                },
              }
            : {
                primary: {
                  main: '#1976d2',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#303030',
                  paper: '#424242',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#aaaaaa',
                },
              }),
        },
        typography: {
          fontFamily: [
            'Montserrat', // Change to your preferred modern font
            'Roboto', // Fallback font
            'Helvetica',
            'Arial',
            'sans-serif',
          ].join(','),
          // You can customize individual typography variants here
          h1: {
            fontFamily: 'Montserrat',
            fontWeight: 700,
          },
          h2: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
          },
          body1: {
            fontFamily: 'Roboto',
            fontWeight: 400,
          },
        },
      }),
    [colorMode]
  );

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
