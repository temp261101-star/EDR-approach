import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';


const ViewPreventedApplication = () => {
  const navigate = useNavigate();

  const data = [
    {
      delete: '🗑️',
      srNo: 1,
      pcName: 'DESKTOP-CMCFJIQ',
      aliasName: 'DESKTOP-CMCFJIQ',
      branchName: 'NA',
      deviceType: 'usb',
      modeOfAccess: 'prevent',
    },
  ];

  return (

    <div className="p-4">

      <button
        onClick={() => navigate(-1)}
        className="ml-9 px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
      >
        ← Back
      </button>

      {/* Table Section */}
      <Table data={data} showCheckboxes={false} />
    </div>

  );
};

export default ViewPreventedApplication;
