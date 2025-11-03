import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../../lib/api'

const ViewMode = () => {
  const [ data , setData]= useState([]);

  useEffect(() => {


    const fetchData = async () => {
      try {
        
        const response = await api.getData("/dashboard/ViewModeListing");

        console.log("reaponse from viw mode", response);
        
        
          setData(response);
        
      } catch (err) {
        console.log("error while fetching the data : ",err)
      } 
    };

    fetchData();

   
  }, []);


    // const navigate = useNavigate();

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


      {/* Table Section */}
      <Table tableTitle="View Mode Table" data={data} />
    </div> 
  )
}

export default ViewMode