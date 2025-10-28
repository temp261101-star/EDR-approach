import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";

const VirusListing = () => {
  const [data, setData] = useState([]);

  // const handleBulkAction = (rows) => {
  //   console.log("Selected rows:", rows);
  //   localStorage.setItem("selectedIPs", JSON.stringify(rows));
  //   navigate("/dashboard/PolicySetup");
  // };

const navigate = useNavigate();
   const handleBulkAction = (selectedData) => {
    console.log("Selected rows:", selectedData);
 localStorage.setItem("selectedIPs", JSON.stringify(selectedData));
    navigate("/dashboard/PolicySetup");  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.fetchResource({
        resource: "getipaddressstatus",
      });
      console.log(response);
      setData(response);
    };

    fetchData();
  }, []);
  console.log("data", data);

  return (
    <div>
      
       <Table 
      data={data}
      onBulkAction={handleBulkAction}
      bulkActionLabel="Process Selected"
      tableTitle="Virus Listing"
      // showCheckboxes={false}
    />
    </div>
  );
};

export default VirusListing;
