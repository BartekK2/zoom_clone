import '../styles/globals.css'
import "../styles/index.css"
import ThemeContext from "../styles/ThemeContext"

import CssBaseline from '@mui/material/CssBaseline';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeContext>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeContext>
    </>)
}

export default MyApp
