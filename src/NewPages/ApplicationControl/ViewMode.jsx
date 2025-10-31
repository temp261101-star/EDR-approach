import React from 'react'
import Table from '../../components/Table'
import { useNavigate } from 'react-router-dom'

const ViewMode = () => {
 
    const navigate = useNavigate();

    const data = [
        {
        srNo : 1,
        pcName:"Desktop1",
        aliasName:"desktop",
        branchName:"Branch1",
        deviceName:"Device1"
        }
    ]

  return (
   <div className="p-4">


      {/* Table Section */}
      <Table data={data} />
    </div> 
  )
}

export default ViewMode