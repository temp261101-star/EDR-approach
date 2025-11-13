import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";

const WebsiteBlacklistHistory = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data API
  const getViewModeDetails = async () => {
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "restrict-site/listing",
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
        <WebsiteBlacklistHistoryTable
          tableData={tableData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default WebsiteBlacklistHistory;


const WebsiteBlacklistHistoryTable = ({ tableData, loading, onBack }) => {
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
          <Table tableTitle="Website Blacklist History Table" data={tableData} />
        </div>
        
      )}
    </>
  );
};

