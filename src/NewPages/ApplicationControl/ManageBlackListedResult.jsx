import Table from '../../components/Table'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";


function ManageBlackListedResult() {

    const navigate = useNavigate();
    const resultData = useSelector((state) => state.app.blacklist.resultData);
    // const data = [
    //     {
    //     srNo : 1,
    //     pcName:"Desktop1",
    //     aliasName:"desktop",
    //     branchName:"Branch1",
    //     deviceName:"Device1"
    //     }
    // ]
    
  return (
   <div className="p-4">

     <button
          onClick={() => navigate(-1)} 
          className="ml-9 px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
        >
          ← Back
        </button>

      {/* Table Section */}
      <Table data={resultData} />
    </div> 
  )
}

export default ManageBlackListedResult