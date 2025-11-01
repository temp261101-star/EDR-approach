import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponentOld";
import { useState } from "react";

const DynamicGraphPage = () => {
    const [open, setOpen] = useState(false);
  
  return (    
    <>
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <PieChartComponent

          onClick={() => setOpen(true)}
          query="SELECT status, COUNT(*) AS total_count FROM dbo.antivirus_scan GROUP BY status ORDER BY total_count DESC;"
          endpoint="demoChart"
          title="Device Security Status"
        />
        <BarChartComponent
          query="SELECT date AS date,
               antivirus_name AS antivirusName,
               scan_type AS scanType,
               system_name AS systemName,
               ip,
               status
              FROM dbo.antivirus_scan
              ORDER BY date;"
          endpoint="demoChartTwo"
          title="Security Anomaly Trends"
        />

    
      </div>
    </>
  );
};

export default DynamicGraphPage;
