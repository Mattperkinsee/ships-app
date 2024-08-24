// src/context/ship-context.jsx

import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create the context
export const ShipContext = createContext();

// Create a provider component
export const ShipProvider = ({ children }) => {
  const [gearDataState, setGearDataState] = useState(null);
  const [itemDataState, setItemDataState] = useState(null);
  const [expandedDataState, setExpandedDataState] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [expandedRowsGear, setExpandedRowsGear] = useState({});
  const [expandedRowsInitial, setExpandedRowsInitial] = useState({});

  return (
    <ShipContext.Provider
      value={{
        gearDataState,
        setGearDataState,
        itemDataState,
        setItemDataState,
        expandedDataState,
        setExpandedDataState,
        progressPercent,
        setProgressPercent,
        expandedRowsGear,
        setExpandedRowsGear,
        expandedRowsInitial,
        setExpandedRowsInitial
      }}
    >
      {children}
    </ShipContext.Provider>
  );
};

// Validate prop types
ShipProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
