import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const [reportData, setReportData] = useState([]);
//   const [dashboardreportData, setDashboardReportData] = useState([]);
//   return (
//     <DataContext.Provider value={{ reportData, setReportData , dashboardreportData, setDashboardReportData }}>
//       {children}
//     </DataContext.Provider>
//   );
// };



export const DataProvider = ({ children }) => {
  const [reportData, setReportData] = useState([]);
  const [dashboardReportData, setDashboardReportData] = useState([]); // Capital R
  return (
    <DataContext.Provider value={{ reportData, setReportData, dashboardReportData, setDashboardReportData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useReportData = () => useContext(DataContext);
