

import React, { useEffect, useRef, useState } from 'react'


import Form, { FormActions, FormFields } from '../../components/Form'

import MultiSelect from '../../components/MultiSelect';
import { DataProvider, useReportData } from '../../context/DataContext';
import DateRangePicker from '../../components/genericTable/DateRangePicker';
import Table from '../../components/Table';
import DateTimeInput from '../../components/FormComponent/DateTimeInput';
import { useNavigate } from 'react-router-dom';
import FormController from '../../lib/FormController';
import api from '../../lib/api';
import toast from 'react-hot-toast';


const WebsiteHistoryReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);


  console.log("showTable : ",showTable);
  


  //  Back Button Handler
  const handleBack = () => {
    setShowTable(false);
  };

  return (
    <div className="mt-10">
      {!showTable ? (
        <WebsiteHistoryReportForm
          onSuccessWebsiteHistoryReport={(response) => {
            setShowTable(true);
            // Load table after submit
            // getBlacklistedDetails();
             console.log("table dataaa response:"+response)
            setTableData(response|| []);
            console.log("table dataaa response:"+response)
          }}
        />
      ) : (

        <div className="mx-5">

          <WebsiteHistoryReportTable
          
          tableData={tableData}
          loading={loading}
          //  Pass back function
          onBack={handleBack}
        /> 
        </div>
       
      )}

    
    </div>
    
  );
};

export default WebsiteHistoryReport;



function WebsiteHistoryReportForm({onSuccessWebsiteHistoryReport}) {

    const formRef = useRef();
    const branchRef = useRef();
    const deviceRef = useRef();
const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!formRef.current) return;

        const controller = new FormController(formRef.current, {
            sources: {
                fetchResource: async ({ resource, parentKey, parentValue }) => {
                    const res = await api.fetchResource({
                        resource,
                        parentKey,
                        parentValue,
                    });
                    if (Array.isArray(res)) {
                        return res.map((branch) => ({
                            value: branch,
                            label: branch,
                        }));
                    }
                    if (res?.branches) {
                        return res.branches.map((b) => ({
                            value: b.id,
                            label: b.name,
                        }));
                    }

                    console.log("returned value in addapplication: ", res);
                    return res;
                },
            },

            actions: {
                websitehistoryreport: async (payload) => {
                    return api.createResource("/websiteprotection/branchwise", payload);
                },
            },

            hooks: {
                onSuccess: (response) => {
                    toast.success("Website History Report data fetched successful");
                     setLoading(false);

                    //  to do ->   add navigation
                    setTimeout(() => {
                        if (formRef.current) {
                            formRef.current.reset();
                        }
                        // formRef.current.reset();

                    }, 100);
                    onSuccessWebsiteHistoryReport(response.recentFileData)
                },
                onError: (error) => {
                    console.error("Submission error:", error);
                    toast.error(error.message);
                },

                onBeforeSubmit: (payload) => {

                            const formatDateTime = (isoString) => {
            if (!isoString) return '';
            const date = new Date(isoString);
            const pad = (n) => n.toString().padStart(2, '0');
            const year = date.getFullYear();
            const month = pad(date.getMonth() + 1);
            const day = pad(date.getDate());
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            const seconds = pad(date.getSeconds());
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };

          // ✅ Modify just the date fields
          payload.from_date = formatDateTime(payload.from_date);
          payload.to_date = formatDateTime(payload.to_date);
                    console.log("Submitting payload:", payload);
                    setLoading(true);
                },
            },
        });

        return () => controller.destroy();
    }, []);
     const reset = () => {
  
            formRef.current.reset();
            deviceRef.current.reset();
            branchRef.current.reset();
            accessRef.current.reset();
      
  };
    return (
         <div className="mt-10">
            <Form ref={formRef} apiAction="websitehistoryreport" title="Website History Report">


                <FormFields grid={2}>
                    <DateTimeInput
                        name="from_date"
                        label="From Date"
                        placeholder="Enter the from Date"
                         data-key="from_date"
                         showTime={true}
                        required
                    />


                    <DateTimeInput
                        name="to_date"
                        label="To Date"
                        placeholder="Enter the To Date"
                         data-key="to_date"
                         showTime={true}
                        required
                    />

                    <MultiSelect
                        name="branches"
                        label="Branch"
                         dataSource="commonMode/getBranchName"
                        // options={[{value:"ISRO" ,name:"ISRO"}]}
                        multiSelect={true}
                        sendAsArray={true}
                        data-key="branches"
                        ref={branchRef}
                        required
                    />

                    <MultiSelect
                        name="deviceNames"
                        label="Host name"
                        ref={deviceRef}
                        dataSource="commonMode/getDeviceOnBranchName"
                        dataDependsOn="branches"
                         data-key="deviceNames"
                    //  options={[{value:"DESKTOP-13021UM" ,name:"DESKTOP-13021UM"}]}
                        multiSelect={true}
                        sendAsArray={true}
                        required
                    />


                </FormFields>

                <FormActions>
                    <button
                        className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                        type="submit" 
                    >
                        {loading?(<p> loading..</p>):(<p>Submit</p>)}  
                    </button>

                    <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                     onClick={reset}>
                        Reset
                    </button>
                </FormActions>
            </Form>



        </div>
    )
}




//  TABLE COMPONENT
const WebsiteHistoryReportTable = ({ tableData, loading, onBack }) => {
 console.log(tableData+"tabledata")
  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 ml-3.5 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-900"
      >
        ← Back
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : tableData.length === 0 ? (

        <div>
  <Table tableTitle="Website History Report Table" />
        </div>
      
      ) : (
        <div>
          <Table tableTitle="Website History Report Table" data={tableData} />
        </div>
        
      )}
    </>
  );
};
