import * as React from "react";
import { useContext, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ShipContext } from "../context/ship-context";
import { TextField } from "@mui/material";
import UpgradeTable from "./ship-upgrades/valor-upgrade-table";
import { ThemeContext } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { colorMode, toggleColorMode } = React.useContext(ThemeContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const {
    gearDataState,
    setGearDataState,
    itemDataState,
    setItemDataState,
    expandedDataState,
    setExpandedDataState,
    setProgressPercent,
  } = useContext(ShipContext);

  // Load initial data from localStorage or JSON files
  useEffect(() => {
    const loadInitialData = async () => {
      const localGearData = JSON.parse(localStorage.getItem("gearData"));
      const localItemData = JSON.parse(localStorage.getItem("itemData"));
      const localExpandedData = JSON.parse(
        localStorage.getItem("expandedData")
      );

      if (localGearData) {
        setGearDataState(localGearData);
      } else {
        const gearData = await fetch(
          "./assets/data/ships/valor/gearData.json"
        ).then((response) => response.json());
        setGearDataState(gearData);
        localStorage.setItem("gearData", JSON.stringify(gearData));
      }

      if (localItemData) {
        setItemDataState(localItemData);
      } else {
        const itemData = await fetch(
          "./assets/data/ships/valor/itemData.json"
        ).then((response) => response.json());
        setItemDataState(itemData);
        localStorage.setItem("itemData", JSON.stringify(itemData));
      }

      if (localExpandedData) {
        setExpandedDataState(localExpandedData);
        console.log("expandeddata1", localExpandedData);
      } else {
        const expandedData = await fetch(
          "./assets/data/ships/valor/expandedData.json"
        ).then((response) => response.json());
        console.log("expandeddata2", expandedData);
        setExpandedDataState(expandedData);
        localStorage.setItem("expandedData", JSON.stringify(expandedData));
      }

      // Calculate the initial total percentage
      calculateTotalPercentage(
        localGearData,
        localItemData,
        localExpandedData
        // localGearData || gearData,
        // localItemData || itemData,
        // localExpandedData || expandedData
      );
    };

    loadInitialData();
  }, []);

  const calculateTotalPercentage = (gearData, itemData, expandedData) => {
    let totalMax = 0;
    let totalCount = 0;

    const accumulateTotals = (data) => {
      if (!data || !Array.isArray(data)) return;
      data.forEach((item) => {
        totalMax += item.max;
        totalCount += item.count;
      });
    };

    // Accumulate totals for gearData and itemData
    accumulateTotals(gearData);
    accumulateTotals(itemData);

    // Accumulate totals for expandedData
    if (expandedData) {
      Object.keys(expandedData).forEach((key) => {
        accumulateTotals(expandedData[key]);
      });
    }

    const overallPercentage = totalMax > 0 ? (totalCount / totalMax) * 100 : 0;
    setProgressPercent(parseFloat(overallPercentage.toFixed(2)));
  };

  // Remove duplicates from items list
  const uniqueItems = [
    ...(gearDataState || []),
    ...(itemDataState || []),
    ...(expandedDataState ? Object.values(expandedDataState).flat() : []),
  ].reduce((acc, item) => {
    if (!acc.find((i) => i.name === item.name)) {
      acc.push(item);
    }
    return acc;
  }, []);

  const handleInventoryInputChange = (name, value) => {
    const updateCount = (state, setState) => {
      const newData = state.map((item) =>
        item.name === name
          ? { ...item, count: value === "" ? 0 : Number(value) }
          : item
      );
      setState(newData);
    };

    updateCount(gearDataState, setGearDataState);
    updateCount(itemDataState, setItemDataState);
    updateCount(
      expandedDataState ? Object.values(expandedDataState).flat() : [],
      setExpandedDataState
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              aria-label="toggle color mode"
            >
              {colorMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* Unique Items */}
        <Box>
          {uniqueItems.map((item) => (
            <Box
              key={item.name}
              sx={{
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
                marginBottom: "1rem", // Add spacing between items
                minHeight: 200,
              }}
            >
              <Box
                alt={item.name}
                component="img"
                src={item.image}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxWidth: 50,
                  marginBottom: "1rem",
                  objectFit: "contain",
                }}
              />
              <Typography
                gutterBottom
                sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                variant="body1"
              >
                {item.name}
              </Typography>
              <TextField
                inputProps={{ min: 0 }}
                onChange={(e) =>
                  handleInventoryInputChange(item.name, e.target.value)
                }
                sx={{ marginBottom: "0.5rem", width: "100%" }}
                type="number"
                value={item.count}
              />
            </Box>
          ))}
        </Box>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <UpgradeTable />
      </Main>
    </Box>
  );
}
