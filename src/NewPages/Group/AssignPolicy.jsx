import React from 'react'
import { useLocation } from 'react-router-dom';


const AssignPolicy = ({node}) => {
      const location = useLocation();
  const receivedData = location.state;

    console.log("check the node in asign policy child : ",receivedData);
    
  return (
    <div>AssignPolicy</div>
  )
}

export default AssignPolicy