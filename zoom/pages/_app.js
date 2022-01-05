import '../styles/globals.css'
import "../styles/index.css"
import "../styles/dashboard.css"
import ThemeContext from "../styles/ThemeContext"
import { AuthProvider } from "./AuthContext"
import Navbar from './components/Navbar'
import CssBaseline from '@mui/material/CssBaseline';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <CssBaseline />
        <ThemeContext>
          <div style={{ display: 'flex', flexFlow: 'column', height: '100vh' }}>

            <Navbar />
            <Component {...pageProps} />
          </div>
        </ThemeContext>
      </AuthProvider>
    </>)
}

export default MyApp
