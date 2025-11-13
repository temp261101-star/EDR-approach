import React, { useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";

import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";

import FormController from "../../lib/FormController";
import api from "../../lib/api";
import Table from "../../components/Table";

const WhiteListedApplication = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data API
  // const getDriveDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await api.fetchResource({
  //       resource: "dashboard/viewApplicationListing",
  //     });
  //     setTableData(res || []);
  //   } catch (err) {
  //     toast.error("Failed to load mode data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //  Back Button Handler
  const handleBack = () => {
    setShowTable(false);
  };

  return (
    <div className="mt-10">
      {!showTable ? (
        // <ViewApplicationForm
        //   onSuccess={() => {
        //     setShowTable(true);

        //     // Load table after submit
        //     getDriveDetails();
        //   }}
        // />
        <WhiteListedApplicationForm
          onSuccesswhitelist={(response) => {
            setShowTable(true);
            setTableData(response || []); // use API response directly
          }}
        />

      ) : (
        <div className="mx-5">
        <WhiteListedApplicationTable
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
export default WhiteListedApplication;



const WhiteListedApplicationForm = ({onSuccesswhitelist}) => {
  const formRef = useRef()
  const branchRef = useRef()
  const deviceRef = useRef()
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
        view1: async (payload) => {
          return api.createResource("/commonMode/ViewWhitelistingListing", payload);
        },
      },

      hooks: {
        onSuccess: (response) => {
           toast.success("Whitelisted Applications Fetched successfully!");
             setLoading(false); 
          // Swal.fire({
          //   title: "Added AntiVirus Successfully!",
          //   icon: "success",
          //   background: "#1e293b",
          //   color: "#e2e8f0",
          //   iconColor: "#4ade80",
          //   padding: "1.25rem",
          //   confirmButtonText: "OK",
          //   confirmButtonColor: "#3b82f6",
          //   customClass: {
          //     popup: "rounded-xl shadow-2xl",
          //     title: "text-lg font-sm ",
          //     confirmButton: "px-4 py-0.5 text-sm",
          //   },
          // });

          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            formRef.current.reset();
            branchRef.current?.reset();
            // StatusRef.current?.reset();
            // VirusRef.current?.reset();
          }, 100);
          onSuccesswhitelist(response.recentFileData)

        },
        onError: (error) => {
          console.error("Submission error:", error);
          toast.error(error.message);
           setLoading(false);
        },

        onBeforeSubmit: (payload) => {
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
           
      
  };

  return (
     <div className="mt-10">
      <Form ref={formRef} apiAction="view1" title="View Whitelisting Report">
        <FormFields grid={2}>

         <MultiSelect
          name="branches"
          label="Branch Name"
         dataSource="commonMode/getBranchName"
          multiSelect={true}
          sendAsArray={true}
          ref={branchRef}
          required
        />

        <MultiSelect
          name="deviceNames"
          label="Device Name"
          dataSource="commonMode/getDeviceOnBranchName"
          ref={deviceRef}
          dataDependsOn="branches"
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

          <button
              type="button"
              className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
               onClick={reset}
            >
              Reset
            </button>

        </FormActions>



      </Form>



    </div>
  )
}

//  TABLE COMPONENT

const WhiteListedApplicationTable = ({ tableData, loading, onBack }) => {

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

        <div className='mx-4'>
          <Table tableTitle="View Application" />
        </div>

      ) : (
        <div className='mx-4'>
          <Table tableTitle="View Application" data={tableData} />
        </div>

      )}
    </>
  );
};