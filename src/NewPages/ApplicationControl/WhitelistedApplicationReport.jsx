import React from 'react'
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';

function WhitelistedApplicationReport() {

    const navigate = useNavigate()

    const data = [
        {
            srNo: 1,
            pcName: 'DESKtOP-CMCFJIQ',
            aliasName: 'DESKTOP-CMCFJIQ',
            branchname: 'NA',
            deviceType: 'usb',
            modeofAccess: 'prevent',
        },
    ];
    return (
   <div className="p-4">

     <button
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
        >
          ← Back
        </button>

      <Table data={data} />
    </div> 
  )
}

export default WhitelistedApplicationReport