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
      <div className="mb-4">
        <div className="flex justify-end mb-2">
          <button
            className="cursor-pointer px-2 py-1 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mr-25 translate-y-2"
            onClick={() => navigate('/dashboard/preventedApplicationReport')}
          >
            Back
          </button>
        </div>

        {/* Table Section */}
        <Table data={data} />
      </div>
    </div>
  );
};

export default ViewPreventedApplication;
