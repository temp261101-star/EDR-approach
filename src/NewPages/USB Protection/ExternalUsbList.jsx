
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

const ExternalUsbList = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); 
  const handleNewForm = () => {
    setShowForm(true); 
  };

  // const handleBack = () => {
  //   setShowForm(false); // show table again
  // };

  const getExternalUsbList = async () => {
     console.log("hyy")
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "usb/getListingRestrictExternalDevice",
      });
      setTableData(res.data.recentFileData|| []);
    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getExternalUsbList();
  }, []);
  return (
    <div className="mt-10 mx-5">
      {!showForm ? (
        <ExternalUsbListTable
          tableData={tableData}
          loading={loading}
          OnNew={handleNewForm}
         
        />
      ) : (
        <ExternalUsbFormData
          onSuccess={() => {
            setShowForm(false); 
          }}
          
        />
      )}
    </div>
  );
};

export default ExternalUsbList;
const ExternalUsbListTable = ({ tableData, loading, onBack, OnNew }) => {
  // alert(tableData)

const navigate=useNavigate();
  return (
    <>
      <div className="flex justify-end mb-2">
        <button onClick={() => navigate('/dashboard/externalUsb/NewExternalUsbForm')}
          className="cursor-pointer px-4 py-1 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2  mr-25 translate-y-2"



        >          New
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tableData.length === 0 ? (

        <div>
          <Table tableTitle="External Usb Table" />
        </div>

      ) : (
        <div>
          <Table tableTitle="External Usb Table" data={tableData} />
        </div>

      )}
    </>
  );
};

