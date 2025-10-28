

import React from "react";
import Table from "./Table";
import DateRangePicker from "./genericTable/DateRangePicker";
import { DataProvider, useReportData } from "../context/DataContext";
import { dummyData } from "../../lib/DummyData";

const ReportContent = () => {
  const { reportData } = useReportData(); 
  console.log(reportData);

  return (
    <div>
      <DateRangePicker  />
      {reportData && reportData.length > 0 &&  <Table data={reportData} />}
      {/* <Table data={dummyData} /> */}
    </div>
  );
};

const ReportPanel = () => {
  return (
    <DataProvider>
      <ReportContent />
    </DataProvider>
  );
};

export default ReportPanel;
