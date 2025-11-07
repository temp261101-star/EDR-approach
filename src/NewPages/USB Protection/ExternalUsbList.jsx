



import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";
import { useNavigate } from 'react-router-dom';

const ExternalUsbList = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);


  // Fetch table data API
  const getExternalUsbDetails = async () => {
    console.log("data getexternal")
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "usb/getListingRestrictExternalDevice",
      });
      setTableData(res.data.recentFileData || []);

    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setLoading(false);
    }
  };

  // Call API when component mounts
  useEffect(() => {
    getExternalUsbDetails();
  }, []); // empty dependency array -> runs once when component mounts

  return (
    <div className="mt-10">
      <div className="mx-5">
        <ExternalUsbListTable
          tableData={tableData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ExternalUsbList;


const ExternalUsbListTable = ({ tableData, loading, onBack }) => {
  // alert(tableData)
    const navigate = useNavigate();
  return (
    <>
     <div className="flex justify-end mb-2">
        <button
          className="cursor-pointer px-4 py-1 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2  mr-25 translate-y-2"
             
                    
         onClick={() => navigate('/dashboard/externalusb/externalusbform')}
         >          New
         </button>
       </div>

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

