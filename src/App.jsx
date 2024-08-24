import "./App.css";
import PersistentDrawerLeft from "./components/drawer";
import { ShipProvider } from "./context/ship-context";
import { ThemeContextProvider } from "./context/ThemeContext";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <ShipProvider>
        <PersistentDrawerLeft />
      </ShipProvider>
    </ThemeContextProvider>
  );
}

export default App;
