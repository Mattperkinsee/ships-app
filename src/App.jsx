import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UpgradeTable from "./components/ship-upgrades/valor-upgrade-table";
// import SideNav from "./components/side-nav";
import PersistentDrawerLeft from "./components/drawer";
import { ShipProvider } from "./context/ship-context";
import { ThemeContextProvider } from "./context/ThemeContext";
import { CssBaseline } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  const [count, setCount] = useState(0);

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
