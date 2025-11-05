import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';

import toast from 'react-hot-toast';
import FormController from '../../lib/FormController';
import api from '../../lib/api';

const PreventedApplicationReport = () => {
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
        <PreventedApplicationReportForm
          onSuccesswhitelist={(response) => {
            setShowTable(true);
            setTableData(response || []); // use API response directly
          }}
        />

      ) : (
        <PreventedApplicationTable
          tableData={tableData}
          loading={loading}
          //  Pass back function
          onBack={handleBack}
        />
      )}


    </div>
  );
};
export default PreventedApplicationReport;


const PreventedApplicationReportForm = () => {
  const formRef = useRef();
  const branchRef = useRef();
  const deviceRef = useRef();
  const navigate = useNavigate();

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

          console.log('returned value in addapplication: ', res);
          return res;
        },
      },

      actions: {
        PreventedApplication: async (payload) => {
           if (Array.isArray(payload.branches)) {
            payload.branches = payload.branches.join(',');
          }
          if (Array.isArray(payload.ip_address)) {
            payload.ip_address = payload.ip_address.join(',');
          }
           payload.branch_name = payload.branches; 
           delete payload.branches; 
          return api.createResource('/EndPointSecurity/ApplicationWhitelisting/ManageBlacklistedprotectionApplicationListing', payload);
        },
      },

      hooks: {
        onSuccess: () => {
          toast.success('PreventedApplicationReport successful');
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
          }, 100);
        },
        onError: (error) => {
          console.error('Submission error:', error);
          toast.error(error.message);
        },
        onBeforeSubmit: (payload) => {
          console.log('Submitting payload:', payload);
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
      <Form ref={formRef} apiAction="PreventedApplication" title="Prevented Application">
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


          <FormActions>
            <button
              className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              type="submit"
            
            >
              Submit
            </button>

            <button
              type="button"
              className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
             onClick={reset}
            >
              Reset
            </button>
          </FormActions>
        </FormFields>
      </Form>
    </div>
  );
};


//  TABLE COMPONENT

const PreventedApplicationTable = ({ tableData, loading, onBack }) => {
  // alert(tableData)
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
  <Table tableTitle="Set Mode Table" />
        </div>
      
      ) : (
        <div>
          <Table tableTitle="Set Mode Table" data={tableData} />
        </div>
        
      )}
    </>
  );
};

