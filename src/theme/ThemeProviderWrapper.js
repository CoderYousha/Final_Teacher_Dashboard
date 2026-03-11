import { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ColorModeContext = createContext();

export default function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');

  const colorMode = useMemo(() => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
        
       localStorage.setItem('theme', mode === "light" ? "dark" : "light");
      },
    }),
    []
  );

  const theme = useMemo( () => createTheme({ 
    palette: { mode, 
      background: { paper: mode === "dark" ? "#121212" : "#ffffff", default: mode === "dark" ? "#1e1e1e" : "#f5f5f5", select: mode === 'dark' ? "#121212" : "#f5f5f5" }, }, typography: { fontFamily: "cairo, Arial, sans-serif", }, }), [mode] );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
