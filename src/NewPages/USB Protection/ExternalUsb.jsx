import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import FormController from "../../lib/FormController";
import CheckBoxGroup from "../../components/FormComponent/CheckBoxGroup"

const ExternalUsb = () => {
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
        <ExternalUsbFormData
          onSuccess={(response) => {
            setShowTable(true);
            setTableData(response || []); // use API response directly
          }}
        />

      ) : (
        <div className="mx-5">
        <ExternalUsbTable
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

export default ExternalUsb;

function ExternalUsbFormData({onSuccess}) {
  const branchRef = useRef()
  const formRef = useRef()
  const deviceRef = useRef();
  const accessRef = useRef();
  const typeRef = useRef();
  // const [showAccessOptions, setShowAccessOptions] = useState(false);
  const [showApplicationFields, setShowApplicationFields] = useState("");
  const [loading, setLoading] = useState(false);
  const writeOptions = [
    { value: "WriteModeDeny", label: "Write Mode Deny" },
  ];
  const executeOptions = [
    { value: "executeOptions ", label: "Execute Mode Deny" },
  ];

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
        externalUsb: async (payload) => {
          return api.createResource("/restrict-usb", payload);
        },
      },

      hooks: {
        onSuccess: (response) => {
         toast.success("Data Fetched Successfully");
           onSuccess(response);
           setLoading(false)

          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            formRef.current.reset();
            StatusRef.current?.reset();
            // StatusRef.current?.reset();
            // VirusRef.current?.reset();
          }, 100);
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
            accessRef.current.reset();
            typeRef.current.reset();
      
  };
  const handleApplicationTypeChange = (event) => {
    const value = event.target.value;

    setShowApplicationFields(event.target.value);
  };

  console.log("showApplicationFields", showApplicationFields)
  return (
    <div className="mt-10">
      <Form ref={formRef} apiAction="externalUsb" title="External USB">
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


          <MultiSelect
            label="Device Type"
            name="deviceType"
            options={[
              { value: "All", name: "All" },
              { value: "MTP", name: "MTP" },
              { value: "USB", name: "USB" }

            ]}
            ref={typeRef}
            sendAsArray={true}
            required
          />

          <MultiSelect
            label="Mode of Access"
            name="modeofaccess"
            options={[
              { value: "Allow", name: "Allow" },
              { value: "Prevent", name: "Prevent" },
              //  { value: "Detect", name: "Detect" }
            ]}
            sendAsArray={false}
            ref={accessRef}
            required
            onChange={handleApplicationTypeChange}
          />

          {showApplicationFields == "Allow" && (
            <>
              <CheckBoxGroup
                name="ExecuteOptions"

                options={executeOptions}


              />
              <CheckBoxGroup
                name="writeOptions"
                options={writeOptions}

              />
            </>
          )}

        </FormFields>

        <FormActions>
          <button type="submit" className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
          >
              {loading?(<p> loading..</p>):(<p>Submit</p>)}  
          </button>
          <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          onClick={reset} >
            Reset
          </button>
        </FormActions>
      </Form>
    </div>
  )
}



const ExternalUsbTable = ({ tableData, loading, onBack }) => {

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
          <Table tableTitle="External Usb Table" />
        </div>

      ) : (
        <div className='mx-4'>
          <Table tableTitle="External Usb Table" data={tableData} />
        </div>

      )}
    </>
  );
};