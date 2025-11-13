
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

const CaptureWebsiteHistory = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getCaptureWebsiteHistoryList = async () => {
    console.log("hyy")
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "getCaptureWebsiteHistoryListing",
      });
      setTableData(res.data || []);
    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCaptureWebsiteHistoryList();
  }, []);
  return (
    <div className="mt-10 mx-5">

      <CaptureWebsiteHistoryTable
        tableData={tableData}
        loading={loading}
      />
    </div>
  );
};

export default CaptureWebsiteHistory;


const CaptureWebsiteHistoryTable = ({ tableData, loading, onBack }) => {
  const navigate = useNavigate();


  return (
    <>
      <div className="flex justify-end mb-2">
        <button onClick={() => navigate('/dashboard/CaptureWebsiteHistory/NewCaptureWebsiteHistoryForm')}
          className="cursor-pointer px-4 py-1 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2  mr-25 translate-y-2"



        >          New
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tableData.length === 0 ? (

        <div>
          <Table tableTitle="Capture Website History Details" />
        </div>

      ) : (
        <div>
          <Table tableTitle="Capture Website History Details" data={tableData} />
        </div>

      )}
    </>
  );
};

