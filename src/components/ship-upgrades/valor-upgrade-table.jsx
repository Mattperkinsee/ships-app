import React, { useEffect, useState, useContext } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import BackpackIcon from "@mui/icons-material/Backpack";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import CircularProgressWithLabel from "@/components/circular-progress";

import { AppLimits } from "@/components/app-limits";
import { ShipContext } from "@/context/ship-context";

function DataTable({
  data,
  expandedRows,
  handleRowToggle,
  expandedData,
  calculatePercentage,
}) {
  if (!data) return null; // Don't render the table if data is not loaded

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Current</TableCell>
            <TableCell>Required</TableCell>
            <TableCell>Completion (%)</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            const itemKey = item.name;
            return (
              <React.Fragment key={itemKey}>
                <TableRow>
                  <TableCell>
                    <Box
                      alt={item.name}
                      component="img"
                      src={item.image}
                      sx={{ width: 40, height: 40, objectFit: "contain" }}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{item.max}</TableCell>
                  <TableCell>
                    <CircularProgressWithLabel
                      value={calculatePercentage(item.count, item.max)}
                    />
                  </TableCell>
                  <TableCell>
                    {item.expand ? (
                      <IconButton onClick={() => handleRowToggle(itemKey)}>
                        {expandedRows[itemKey] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
                {item.expand ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{ padding: 0, borderBottom: "none" }}
                    >
                      <Collapse
                        in={expandedRows[itemKey]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  {/* <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.name}
                                    sx={{ width: 40, height: 40, objectFit: 'contain' }}
                                  /> */}
                                </TableCell>
                                <TableCell>Sub-Parts</TableCell>
                                <TableCell>Count</TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>Completion (%)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {expandedData[item.name]?.map((subItem) => {
                                const subItemKey = `${itemKey}-${subItem.name}`;
                                return (
                                  <TableRow key={subItemKey}>
                                    <TableCell>
                                      <Box
                                        alt={subItem.name}
                                        component="img"
                                        src={subItem.image}
                                        sx={{
                                          width: 40,
                                          height: 40,
                                          objectFit: "contain",
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>{subItem.name}</TableCell>
                                    <TableCell>{subItem.count}</TableCell>
                                    <TableCell>{subItem.max}</TableCell>
                                    <TableCell>
                                      <CircularProgressWithLabel
                                        value={calculatePercentage(
                                          subItem.count,
                                          subItem.max
                                        )}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function UpgradeTable() {
  const {
    gearDataState,
    setGearDataState,
    itemDataState,
    setItemDataState,
    expandedDataState,
    progressPercent,
    expandedRowsGear,
    setExpandedRowsGear,
    expandedRowsInitial,
    setExpandedRowsInitial,
  } = useContext(ShipContext);

  // const [gearDataState, setGearDataState] = useState(null);
  // const [itemDataState, setItemDataState] = useState(null);
  // const [expandedDataState, setExpandedDataState] = useState(null);
  // const [expandedRowsGear, setExpandedRowsGear] = useState({});
  // const [expandedRowsInitial, setExpandedRowsInitial] = useState({});
  // const [progressPercent, setProgressPercent] = useState(0);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  // Load initial data from localStorage or JSON files
  // useEffect(() => {
  //   const loadInitialData = async () => {
  //     const localGearData = JSON.parse(localStorage.getItem('gearData'));
  //     const localItemData = JSON.parse(localStorage.getItem('itemData'));
  //     const localExpandedData = JSON.parse(localStorage.getItem('expandedData'));

  //     if (localGearData) {
  //       setGearDataState(localGearData);
  //     } else {
  //       const gearData = await fetch('/assets/data/ships/valor/gearData.json').then((response) => response.json());
  //       setGearDataState(gearData);
  //       localStorage.setItem('gearData', JSON.stringify(gearData));
  //     }

  //     if (localItemData) {
  //       setItemDataState(localItemData);
  //     } else {
  //       const itemData = await fetch('/assets/data/ships/valor/itemData.json').then((response) => response.json());
  //       setItemDataState(itemData);
  //       localStorage.setItem('itemData', JSON.stringify(itemData));
  //     }

  //     if (localExpandedData) {
  //       setExpandedDataState(localExpandedData);
  //     } else {
  //       const expandedData = await fetch('/assets/data/ships/valor/expandedData.json').then((response) =>
  //         response.json()
  //       );
  //       setExpandedDataState(expandedData);
  //       localStorage.setItem('expandedData', JSON.stringify(expandedData));
  //     }

  //     // Calculate the initial total percentage
  //     calculateTotalPercentage(localGearData || gearData, localItemData || itemData, localExpandedData || expandedData);
  //   };

  //   loadInitialData();
  // }, []);

  // Calculate total percentage whenever data changes
  // useEffect(() => {
  //   calculateTotalPercentage(gearDataState, itemDataState, expandedDataState);
  // }, [gearDataState, itemDataState, expandedDataState]);

  // Save gearDataState to localStorage when it changes
  useEffect(() => {
    if (gearDataState) {
      localStorage.setItem("gearData", JSON.stringify(gearDataState));
    }
  }, [gearDataState]);

  // Save itemDataState to localStorage when it changes
  useEffect(() => {
    if (itemDataState) {
      localStorage.setItem("itemData", JSON.stringify(itemDataState));
    }
  }, [itemDataState]);

  // Save expandedDataState to localStorage when it changes
  useEffect(() => {
    if (expandedDataState) {
      console.log("exp[anded", expandedDataState);
      localStorage.setItem("expandedData", JSON.stringify(expandedDataState));
    }
  }, [expandedDataState]);

  // const handleInputChange = (name, value, isEditing, isGearData) => {
  //   const updateState = (state, setState) => {
  //     const newData = state.map((item) =>
  //       item.name === name ? { ...item, count: value === '' ? 0 : Number(value), isEditing } : item
  //     );
  //     setState(newData);
  //   };

  //   if (isGearData) {
  //     updateState(gearDataState, setGearDataState);
  //   } else {
  //     updateState(itemDataState, setItemDataState);
  //   }
  // };

  // const handleSubItemInputChange = (parentName, subItemName, value, isEditing) => {
  //   const currentExpandedData = expandedDataState || {};

  //   const updatedParentItems = (currentExpandedData[parentName] || []).map((subItem) =>
  //     subItem.name === subItemName ? { ...subItem, count: value === '' ? 0 : Number(value), isEditing } : subItem
  //   );

  //   const updatedExpandedData = {
  //     ...currentExpandedData,
  //     [parentName]: updatedParentItems,
  //   };

  //   setExpandedDataState(updatedExpandedData);
  // };

  const calculatePercentage = (count, max) => {
    const result = max > 0 ? (count / max) * 100 : 0;
    return parseFloat(result.toFixed(2));
  };

  const handleRowToggle = (name, setExpandedRows) => {
    setExpandedRows((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Handling Inventory Modal
  const openInventoryModal = () => {
    setIsInventoryModalOpen(true);
  };

  const closeInventoryModal = () => {
    setIsInventoryModalOpen(false);
  };

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
    // updateCount(expandedDataState ? Object.values(expandedDataState).flat() : [], setExpandedDataState);
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

  return (
    <Box sx={{ padding: "2rem" }}>
      <Grid alignItems="center" container spacing={2}>
        <Grid item md={4} xs={12}>
          <Typography gutterBottom variant="h4">
            Valor Ship Upgrade Materials
          </Typography>
          <Button
            color="primary"
            onClick={openInventoryModal}
            startIcon={<BackpackIcon />}
            variant="contained"
          >
            Inventory
          </Button>
        </Grid>
        <Grid item md={4} sx={{ textAlign: { xs: "left" } }} xs={12}>
          <AppLimits usage={progressPercent} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          {gearDataState ? (
            <DataTable
              data={gearDataState}
              expandedRows={expandedRowsGear}
              // handleInputChange={(name, value, isEditing) => handleInputChange(name, value, isEditing, true)}
              handleRowToggle={(name) =>
                handleRowToggle(name, setExpandedRowsGear, expandedRowsGear)
              }
              expandedData={expandedDataState || {}} // Ensure expandedDataState is not null
              // handleSubItemInputChange={(parentName, subItemName, value, isEditing) =>
              //   handleSubItemInputChange(parentName, subItemName, value, isEditing)
              // }
              calculatePercentage={calculatePercentage}
            />
          ) : null}
        </Grid>
        <Grid item md={6} xs={12}>
          {itemDataState ? (
            <DataTable
              data={itemDataState}
              expandedRows={expandedRowsInitial}
              // handleInputChange={(name, value, isEditing) => handleInputChange(name, value, isEditing, false)}
              handleRowToggle={(name) =>
                handleRowToggle(
                  name,
                  setExpandedRowsInitial,
                  expandedRowsInitial
                )
              }
              expandedData={expandedDataState || {}} // Ensure expandedDataState is not null
              // handleSubItemInputChange={(parentName, subItemName, value, isEditing) =>
              //   handleSubItemInputChange(parentName, subItemName, value, isEditing)
              // }
              calculatePercentage={calculatePercentage}
            />
          ) : null}
        </Grid>
      </Grid>
      <Dialog
        fullScreen
        onClose={closeInventoryModal}
        open={isInventoryModalOpen}
      >
        <DialogTitle>
          Inventory
          <IconButton
            aria-label="close"
            color="inherit"
            edge="end"
            onClick={closeInventoryModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {uniqueItems.map((item) => (
              <Grid item key={item.name} lg={2} md={3} sm={6} xs={12}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "center",
                    height: "100%", // Ensure the box takes up the full height of the grid item
                    minHeight: 200, // Set a consistent minimum height for all boxes
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
                    sx={{ marginBottom: "0.5rem", width: "100%" }} // Ensure the input field takes up the full width
                    type="number"
                    value={item.count}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

DataTable.propTypes = {
  data: PropTypes.node.isRequired,
  expandedRows: PropTypes.node.isRequired,
  handleRowToggle: PropTypes.node.isRequired,
  expandedData: PropTypes.node.isRequired,
  calculatePercentage: PropTypes.node.isRequired,
};
