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
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {

                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        cursor: "pointer",
                    },
                    " > *": {
                        width: "100%",
                    },
                    padding: "0 20px",

                },
                label: {
                    textAlign: 'center',
                },
            },
        },
    },
});

function ThemeContext({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeContext
