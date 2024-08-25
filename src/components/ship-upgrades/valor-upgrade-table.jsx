import React, { useEffect, useContext } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import CircularProgressWithLabel from "@/components/circular-progress";
import { useTheme } from "@mui/material/styles";
import { AppLimits } from "@/components/app-limits";
import { ShipContext } from "@/context/ship-context";

function DataTable({
  data,
  expandedRows,
  handleRowToggle,
  expandedData,
  calculatePercentage,
}) {
  const theme = useTheme(); // Use theme here
  if (!data) return null; // Don't render the table if data is not loaded

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
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
  const theme = useTheme();

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

  return (
    <Box sx={{ padding: "0rem" }}>
      <Grid alignItems="center" container spacing={2}>
        <Grid item md={4} xs={12}></Grid>
        <Grid item md={4} sx={{ textAlign: { xs: "left" } }} xs={12}>
          <AppLimits usage={progressPercent} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ position: "relative", top: '-85px' }}>
        <Grid item md={6} xs={12}>
          {gearDataState ? (
            <DataTable
              data={gearDataState}
              theme={theme}
              expandedRows={expandedRowsGear}
              handleRowToggle={(name) =>
                handleRowToggle(name, setExpandedRowsGear, expandedRowsGear)
              }
              expandedData={expandedDataState || {}} // Ensure expandedDataState is not null
              calculatePercentage={calculatePercentage}
            />
          ) : null}
        </Grid>
        <Grid item md={6} xs={12}>
          {itemDataState ? (
            <DataTable
              data={itemDataState}
              theme={theme}
              expandedRows={expandedRowsInitial}
              handleRowToggle={(name) =>
                handleRowToggle(
                  name,
                  setExpandedRowsInitial,
                  expandedRowsInitial
                )
              }
              expandedData={expandedDataState || {}} // Ensure expandedDataState is not null
              calculatePercentage={calculatePercentage}
            />
          ) : null}
        </Grid>
      </Grid>
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
