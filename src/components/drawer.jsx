import * as React from "react";
import { useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ShipContext } from "../context/ship-context";
import { TextField } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Paper } from "@mui/material";
import CustomTabs from "./tab-panel";

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
  //   const theme = useTheme();
//   const [open, setOpen] = React.useState(true);
  const { colorMode, toggleColorMode } = React.useContext(ThemeContext);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

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
      calculateTotalPercentage(localGearData, localItemData, localExpandedData);
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
    console.log("name", name);
    console.log("value", value);

    if (!value || value === "") value = 0;

    const updateCount = (state, setState, callback) => {
      setState((prevState) => {
        let newData;

        if (Array.isArray(prevState)) {
          // This case handles gearDataState and itemDataState which are arrays
          newData = prevState.map((item) => {
            if (item.name === name) {
              const newValue = Math.min(Number(value), item.max);
              return { ...item, count: newValue };
            }
            return item;
          });
        } else if (typeof prevState === "object" && prevState !== null) {
          // This case handles expandedDataState which is an object with arrays as values
          newData = {
            ...prevState,
            ...Object.keys(prevState).reduce((acc, key) => {
              acc[key] = prevState[key].map((item) => {
                if (item.name === name) {
                  const newValue = Math.min(Number(value), item.max);
                  return { ...item, count: newValue };
                }
                return item;
              });
              return acc;
            }, {}),
          };
        }

        if (callback) callback(newData);

        return newData;
      });
    };

    updateCount(gearDataState, setGearDataState, (newGearData) => {
      updateCount(itemDataState, setItemDataState, (newItemData) => {
        updateCount(
          expandedDataState,
          setExpandedDataState,
          (newExpandedData) => {
            calculateTotalPercentage(newGearData, newItemData, newExpandedData);
          }
        );
      });
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={"true"}>
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton> */}

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "right" }}>
            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              aria-label="toggle color mode"
            >
              {colorMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
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
            // Hide scrollbar
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none", // For Internet Explorer and Edge
            scrollbarWidth: "none", // For Firefox
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader></DrawerHeader>
        <Divider />
        {/* Unique Items */}
        <Box>
          {uniqueItems.map((item) => (
            <Paper elevation={1} key={item.name}>
              <Box
                sx={{
                  padding: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "1rem", // Add spacing between items
                }}
              >
                <Typography
                  gutterBottom
                  sx={{ fontSize: "0.95rem" }}
                  variant="body1"
                >
                  {item.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem", // Adjust gap as needed between image and TextField
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
                      objectFit: "contain",
                    }}
                  />
                  <TextField
                    inputProps={{ min: 0 }}
                    onChange={(e) =>
                      handleInventoryInputChange(item.name, e.target.value)
                    }
                    sx={{ width: "100px" }}
                    type="text"
                    value={item.count}
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <CustomTabs />
      </Main>
    </Box>
  );
}
