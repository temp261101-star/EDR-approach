
import { useEffect, useRef, useState } from "react";
import FormController from "../../lib/FormController";
import api from "../../lib/api";
import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import Table from "../../components/Table";
import toast from "react-hot-toast";


const WebsiteBlacklistingForm = () => {
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
        <NewWebsiteBlacklistingForm
          onSuccess={(response) => {
            setShowTable(true);
            setTableData(response || []); // use API response directly
          }}
        />

      ) : (
        <div className="mx-5">
          <WebsiteBlacklistingTable
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


export default WebsiteBlacklistingForm;

function NewWebsiteBlacklistingForm({ onSuccess }) {
  console.log("show table true")
  const formRef = useRef();
  const branchRef = useRef();
  const deviceRef = useRef();
  const accessRef = useRef();
  const webRef = useRef();
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
        Websiteblacklist: async (payload) => {
          // if (Array.isArray(payload.branches)) {
          //   payload.branches = payload.branches.join(',');
          // }
          // if (Array.isArray(payload.ipaddress)) {
          //   payload.ipaddress = payload.ipaddress.join(',');
          // }
          //  if (Array.isArray(payload.modeOfAccess)) {
          //   payload.modeOfAccess = payload.modeOfAccess.join(',');
          // }
          //  if (Array.isArray(payload.websiteName)) {
          //   payload.websiteName = payload.websiteName.join(',');
          // }
          return api.createResource("/commonMode/blacklist/WebsiteBL", [payload]);
        },
      },

      hooks: {
        onSuccess: (response) => {
          toast.success("Website blacklist successful");
          setLoading(false)

          //  to do ->   add navigation
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            formRef.current.reset();

          }, 100);
          onSuccess(response);
        },
        onError: (error) => {
          console.error("Submission error:", error);
          toast.error(error.message);
          setLoading(false)
        },

        onBeforeSubmit: (payload) => {
          console.log("Submitting payload:", payload);
          setLoading(true)
        },
      },
    });

    return () => controller.destroy();
  }, []);
  const reset = () => {

    formRef.current.reset();
    deviceRef.current.reset();
    branchRef.current.reset();
    webRef.current.reset();
    accessRef.current.reset();
  };
  return (
    <div className="mt-10">

      <Form ref={formRef} apiAction="Websiteblacklist" title="Website Blacklisting">

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
            name="ipaddress"
            label="Device Name"
            dataSource="commonMode/getDeviceOnBranchName"
            ref={deviceRef}
            dataDependsOn="branches"
            multiSelect={true}
             sendAsArray={true}
            required
          />

          <MultiSelect

            label="Mode Of Access"
            name="modeOfAccess"
            ref={accessRef}
            options={[
              { value: "allow", name: "Allow" },
              { value: "block", name: "Prevent" },


            ]}
            required
          />

          <MultiSelect

            label="Website Name"
            name="websiteName"
            ref={webRef}
            dataSource="commonMode/getWebsiteList"

            
            multiSelect={true}
            //  sendAsArray={true}
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
            onClick={reset}
          >
            Reset
          </button>

        </FormActions>


      </Form>

    </div>
  )
}




const WebsiteBlacklistingTable = ({ tableData, loading, onBack }) => {

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
          <Table tableTitle="Website Blacklisting Table" />
        </div>

      ) : (
        <div className='mx-4'>
          <Table tableTitle="Website Blacklisting Table" data={tableData} />
        </div>

      )}
    </>
  );
};