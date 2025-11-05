import React, { useEffect, useRef, useState } from "react";

import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import FormController from "../../lib/FormController";
import api from "../../lib/api";
import { useDispatch } from "react-redux";

import { setBlacklistResultData } from "../../store/appSlice";
import Table from "../../components/Table";


const ManageBlackListed = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);


  console.log("showTable : ",showTable);
  

  // // Fetch table data API
  // const getBlacklistedDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await api.fetchResource({
  //       resource: "commonMode/ManageBlacklistedApplicationListing",
  //     });

  //     console.log("response in getBlacklistedDetails : ",res);
      
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
        <ManageBlackListedForm
          onSuccessHandle={(response) => {
            setShowTable(true);
            // Load table after submit
            // getBlacklistedDetails();
            setTableData(response || []);
            console.log("table dataaa response:"+response)
          }}
        />
      ) : (

        <div className="mx-5">

          <ManageBlacklistedTable
          
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

export default ManageBlackListed;

const ManageBlackListedForm = ({onSuccessHandle}) => {
  const formRef = useRef();
  const deviceRef = useRef();
  const branchRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        AddManagedBlacklisted: async (payload) => {

          if (Array.isArray(payload.branches)) {
            payload.branches = payload.branches.join(',');
          }
          if (Array.isArray(payload.ip_address)) {
            payload.ip_address = payload.ip_address.join(',');
          }

          return api.createResource(
            "/commonMode/ManageBlacklistedApplicationListing",
            payload
          );
        },
      },

      hooks: {
        onSuccess: (response) => {
          toast.success("Data Submitted Successfully");
          console.log("API response", response);
          dispatch(setBlacklistResultData(response.recentFileData));
            setLoading(false); 

          //  to do ->   add navigation
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            // formRef.current.reset();
            // navigate("/dashboard/manageBlacklisted/manageBlacklistedResult");
          }, 100);
          onSuccessHandle(response.recentFileData);

        },
        onError: (error) => {
          console.error("Submission error:", error);
          toast.error(error.message+"hyy");
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
            accessRef.current.reset();
      
  };
  return (
    <div className="mt-10">
      <Form
        ref={formRef}
        apiAction="AddManagedBlacklisted"
        title="Manage Blacklisting Application"
      >
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
            name="ip_address"
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
  );
};




//  TABLE COMPONENT
const ManageBlacklistedTable = ({ tableData, loading, onBack }) => {
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
  <Table tableTitle="Manage Blacklisted Table" />
        </div>
      
      ) : (
        <div>
          <Table tableTitle="Manage Blacklisted Table" data={tableData} />
        </div>
        
      )}
    </>
  );
};
