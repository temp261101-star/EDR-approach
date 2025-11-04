

// const ViewMode = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch table data API
//   const getViewModeDetails = async () => {
//     setLoading(true);
//     try {
//       const res = await api.fetchResource({
//         resource: "dashboard/ViewModeListing",
//       });
//       setTableData(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load mode data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  Back Button Handler
//   const handleBack = () => {
//     setShowTable(false);
//   };

//   return (
//     <div className="mt-10">
   

//         <div className="mx-5">

//           <ViewModeTable
//           tableData={tableData}
//           loading={loading}
//           //  Pass back function
//           onBack={handleBack}
//         /> 
//         </div>
       
      

    
//     </div>
//   );
// };

// export default ViewMode;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";

const ViewMode = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data API
  const getViewModeDetails = async () => {
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "dashboard/ViewModeListing",
      });
      setTableData(res.data || []);
    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setLoading(false);
    }
  };

  // Call API when component mounts
  useEffect(() => {
    getViewModeDetails();
  }, []); // empty dependency array -> runs once when component mounts

  return (
    <div className="mt-10">
      <div className="mx-5">
        <ViewModeTable
          tableData={tableData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ViewMode;


const ViewModeTable = ({ tableData, loading, onBack }) => {
  // alert(tableData)
  return (
    <>
    

      {loading ? (
        <p>Loading...</p>
      ) : tableData.length === 0 ? (

        <div>
  <Table tableTitle="View Mode Table" />
        </div>
      
      ) : (
        <div>
          <Table tableTitle="View Mode Table" data={tableData} />
        </div>
        
      )}
    </>
  );
};

