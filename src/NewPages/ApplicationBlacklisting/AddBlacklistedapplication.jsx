
import React, { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';
import FormController from '../../lib/FormController';
import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';
import TextInput from '../../components/FormComponent/TextInput';
import toast from 'react-hot-toast';
import Table from '../../components/Table';
// import { toast } from 'react-toastify';
const AddBlacklistedapplication = () => {
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
        <AddBlacklistedapplicationForm
          onSuccessAddBlacklist={(response) => {
            setShowTable(true);
            // Load table after submit
            // getBlacklistedDetails();
            setTableData(response || []);
            console.log("table dataaa response:"+response)
          }}
        />
      ) : (

        <div className="mx-5">

          <AddBlacklistedapplicationTable
          
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
export default AddBlacklistedapplication;



const AddBlacklistedapplicationForm = ({onSuccessAddBlacklist}) => {
  const formRef = useRef(null);
  const branchRef = useRef();
  const deviceRef = useRef();
  const typeRef = useRef();

  const [reloadTable, setReloadTable] = useState(0);
  const [showApplicationFields, setShowApplicationFields] = useState("");
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

          return res;
        },
      },

      actions: {

        addblacklistedapplication: async (payload) => {

          //  if (Array.isArray(payload.branches)) {
          //   payload.branches = payload.branches.join(',');
          // }
          // if (Array.isArray(payload.devices)) {
          //   payload.devices = payload.devices.join(',');
          // }
          return api.createResource("/ApplicationBlacklisting/AddApplicationSet", payload);
        },
      },

      hooks: {
        onSuccess: (response) => {
          toast.success("Trusted Application Added!");
            setLoading(false); 

          // Hide conditional fields first
          setShowApplicationFields("");

          // Clear input values manually so hidden inputs don't retain data
          formRef.current.querySelectorAll("input").forEach(i => (i.value = ""));

          // Reset dropdown values
          setTimeout(() => {
            formRef.current?.reset();
            branchRef.current?.reset();
            deviceRef.current?.reset();
            typeRef.current?.reset();
          }, 0);
          onSuccessAddBlacklist(response);

          setReloadTable(prev => prev + 1);
        },
        onBeforeSubmit: () => {
    setLoading(true); 
  },
   onError: (err) => {
    toast.error(err.message || "Submission failed!");
    setLoading(false); 
  },
      },
    });

    return () => controller.destroy();
  }, []);

  const handleApplicationTypeChange = (event) => {
    setShowApplicationFields(event.target.value);
  };

  function handleReset() {
    setShowApplicationFields("");

    // Clear inputs manually too
    formRef.current.querySelectorAll("input").forEach(i => (i.value = ""));

    setTimeout(() => {
      formRef.current?.reset();
      branchRef.current?.reset();
      deviceRef.current?.reset();
      typeRef.current?.reset();
    }, 0);
  }

  return (
    <div className="mt-10">
      <Form ref={formRef} apiAction="addblacklistedapplication" title="Add Blacklist Application">
        <FormFields grid={2}>
          <MultiSelect
            name="branches"
            label="Branch Name"
            dataSource="commonMode/getBranchName"
            multiSelect={true}
            sendAsArray={true}
            data-key="branches"
            ref={branchRef}
            required
          />

          <MultiSelect
            name="devices"
            label="Device Name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName"
            dataDependsOn="branches"
            data-param="branches"
            data-key="devices"
            multiSelect={true}
            sendAsArray={true}
            required
          />

          <MultiSelect
            label="Type"
            name="type"
            ref={typeRef}
            onChange={handleApplicationTypeChange}
            options={[
              
              { value: "Application Path", name: "Application Path" },
            ]}
            required
          />

          {showApplicationFields === "Application Path" && (
            <>
              <TextInput
                label="Application Path"
                name="applicationPath"
                placeholder="Enter Application Name"
                required
              />
              <TextInput
                label="Hash (SHA-256)"
                name="applicationHash"
                placeholder="Enter Hash (SHA-256)"
                required
              />
            </>
          )}
        </FormFields>

        <FormActions>
          <button
            type="submit"
            className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
          >
             {loading?(<p> loading..</p>):(<p>Submit</p>)}  
          </button>

          <button
            type="button"
            className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            onClick={handleReset}
          >
            Reset
          </button>
        </FormActions>
      </Form>
    </div>
  );
};




//  TABLE COMPONENT
const AddBlacklistedapplicationTable = ({ tableData, loading, onBack }) => {
  console.log(tableData + "tabledata")
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
          <Table tableTitle="Add Blacklist Application Table" />
        </div>

      ) : (
        <div>
          <Table tableTitle="Add Blacklist Application Table" data={tableData} />
        </div>

      )}
    </>
  );
};
