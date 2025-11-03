import React from 'react'
import Table from '../../components/Table'

function WebsiteBlacklistHistory() {

  const data = [
  {
    
    srNo: 1,
    pcName: 'DESKTOP-CMCFIJQ',
    aliasName: 'DESKTOP-CMCFIJQ',
    websiteName: 'www.amazon.in',
    modeOfAccess: 'Allow',
    branchName: 'NA',
  },
  {
   
    srNo: 2,
    pcName: 'SHITAL-DHYAGUDE',
    aliasName: 'SHITAL-DHYAGUDE',
    websiteName: 'www.flipkart.com',
    modeOfAccess: 'Prevent',
    branchName: 'Pune',
  },]
  return (
   <div>
   
           {/* Table Section */}
           <Table data={data} showCheckboxes={false} />
        
       </div>
  )
}

export default WebsiteBlacklistHistory
