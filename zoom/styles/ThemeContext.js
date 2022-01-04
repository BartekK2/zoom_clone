import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#f85a5a',
        },
        secondary: {
            main: '#edf2ff',
        },
    },
});

function ThemeContext({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeContext
