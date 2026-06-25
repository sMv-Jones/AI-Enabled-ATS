import { createContext, useContext } from 'react';

const DataContext = createContext(null);
const DataProvider = DataContext.Provider; 
const useDataContext = () => useContext(DataContext);

export { DataContext, DataProvider, useDataContext };