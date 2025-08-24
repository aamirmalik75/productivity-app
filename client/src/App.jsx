import Main from "./scenes/global/index.jsx";
import SignUp from "./scenes/signUp";
import SignIn from "./scenes/signIn";
import { ColorModeContext, tokens, useMode } from "./theme.js"
import { Box, CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import { Route, Routes } from "react-router-dom";
import CustomAlert from './components/CustomAlert.jsx';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { alert, user, token } = useSelector(state => state.user);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.palette.mode);
    const init = async () => {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      if (token) {
        const r = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/goal/dead?now=${formattedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
        );
      }
    }
    init()
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className="app" sx={{ "& ::selection": { backgroundColor: theme.palette.primary.main, color: colors.text } }} >
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/*" element={<Main />} />
          </Routes>
          {alert && <CustomAlert />}
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
