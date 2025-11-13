import React, { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';
import FormController from '../../lib/FormController';
import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
// import { toast } from 'react-toastify';

const ManageWhitelisted = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);


  console.log("showTable : ", showTable);


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
        <ManageWhitelistedForm
          onSuccessManageWhitelist={(response) => {
            setShowTable(true);
            // Load table after submit
            // getBlacklistedDetails();
            setTableData(response || []);
            console.log("table dataaa response:" + response)
          }}
        />
      ) : (

        <div className="mx-5">

          <ManageWhitelistedTable

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

export default ManageWhitelisted;

const ManageWhitelistedForm = ({ onSuccessManageWhitelist }) => {
  const formRef = useRef(null);
  const branchRef = useRef();
  const deviceRef = useRef();
  const typeRef = useRef();
  const [loading, setLoading] = useState(false);
  const [reloadTable, setReloadTable] = useState(0);
  const [showApplicationFields, setShowApplicationFields] = useState("");

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

          // ✅ If the API returns { data: [...] }
          if (Array.isArray(res?.data)) {
            return res.data.map(item => ({ value: item, label: item }));
          }

          return res;
        },
      },

      actions: {
        manageWhitelistedApplication: async (payload) => {
          return api.createResource("commonMode/manageWhitelisting", payload);
        },
      },

      hooks: {
        onSuccess: (response) => {
          toast.success("Data Added Successfully");
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
          onSuccessManageWhitelist(response)

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
      <Form ref={formRef} apiAction="manageWhitelistedApplication" title="Manage Whitelisted Application">
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
            name="ip_address"
            label="Device Name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName"
            dataDependsOn="branches"
            data-param="branches"
            data-key="ip_address"
            multiSelect={true}
            sendAsArray={true}
            required
          />
          <MultiSelect
            name="appname"
            label="Application Name"
            ref={typeRef}
            dataSource="commonMode/ApplicationName"
            dataDependsOn="ip_address"
            data-param="ip_address"
            //  dataDependsOn={["branches", "ip_address"]} 
            // data-param="ip_address,branches"
            data-key="appname"
            multiSelect={true}
            sendAsArray={true}
            required
          />




        </FormFields>

        <FormActions>
          <button
            type="submit"
            className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
          >
            {loading ? (<p> loading..</p>) : (<p>Submit</p>)}
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
const ManageWhitelistedTable = ({ tableData, loading, onBack }) => {
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
          <Table tableTitle="Manage Whitelisted Table" />
        </div>

      ) : (
        <div>
          <Table tableTitle="Manage Whitelisted Table" data={tableData} />
        </div>

      )}
    </>
  );
};
