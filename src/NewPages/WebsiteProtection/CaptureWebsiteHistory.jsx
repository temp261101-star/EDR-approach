
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";
import FormController from "../../lib/FormController";
import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import RadioGroup from "../../components/FormComponent/RadioGroup";
import TextInput from "../../components/FormComponent/TextInput";

const CaptureWebsiteHistory = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); 
  const handleNewForm = () => {
    setShowForm(true); 
  };

  // const handleBack = () => {
  //   setShowForm(false); // show table again
  // };

  const getCaptureWebsiteHistoryList = async () => {
     console.log("hyy")
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "usb/getListingRestrictExternalDevice",
      });
      setTableData(res.data.recentFileData|| []);
    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCaptureWebsiteHistoryList();
  }, []);
  return (
    <div className="mt-10 mx-5">
      {!showForm ? (
        <CaptureWebsiteHistoryTable
          tableData={tableData}
          loading={loading}
          OnNew={handleNewForm}
         
        />
      ) : (
        <CaptureWebsiteHistoryForm
          onSuccess={() => {
            setShowForm(false); 
          }}
          
        />
      )}
    </div>
  );
};

export default CaptureWebsiteHistory;

function CaptureWebsiteHistoryForm() {
  const branchRef = useRef()
  const formRef = useRef()
  const deviceRef = useRef();
  const typeRef = useRef();
  // const [showAccessOptions, setShowAccessOptions] = useState(false);
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

          console.log("returned value in addapplication: ", res);
          return res;
        },
      },
      actions: {
        capturewebsitehistory: async (payload) => {
          return api.createResource("/getListingRestrictExternalDevice", payload);
        },
      },

      hooks: {
        onSuccess: () => {
          Swal.fire({
            title: "Added Capture Website History Successfully!",
            icon: "success",
            background: "#1e293b",
            color: "#e2e8f0",
            iconColor: "#4ade80",
            padding: "1.25rem",
            confirmButtonText: "OK",
            confirmButtonColor: "#3b82f6",
            customClass: {
              popup: "rounded-xl shadow-2xl",
              title: "text-lg font-sm ",
              confirmButton: "px-4 py-0.5 text-sm",
            },
          });

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
        },

        onBeforeSubmit: (payload) => {
          console.log("Submitting payload:", payload);
        },
      },
    });

    return () => controller.destroy();
  }, []);

  const handleApplicationTypeChange = (event) => {
    const value = event.target.value;

    setShowApplicationFields(event.target.value);
  };

  console.log("showApplicationFields", showApplicationFields)
  
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
      <Form ref={formRef} apiAction="capturewebsitehistory" title="Capture Website History">
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
            name="deviceName"
            label="Device Name"
            dataSource="commonMode/getDeviceOnBranchName"
            ref={deviceRef}
            dataDependsOn="branches"
            multiSelect={true}
            sendAsArray={true}
            required
          />
          <RadioGroup
          name="Mechanism"
          label="Mechanism"

               options={[{ value: "Alert", label: "Alert" }]}
          />


          <MultiSelect
            label="Parameter"
            name="parameter"
            options={[
              { value: "All", name: "All" },
              { value: "Custom", name: "Custom" },
              

            ]}
            ref={typeRef}
            onChange={handleApplicationTypeChange}
            required
          />

          

          {showApplicationFields == "Custom" && (
            <>
              <MultiSelect
            name="CategoryName"
           label ="Category Name"
        
          //  dataSource="commonMode/getDeviceOnBranchName"
            ref={deviceRef}
            dataDependsOn="branches"
            multiSelect={true}
            sendAsArray={true}
            required
          />
          <TextInput
          name="customname"
          label="Custom"
          />
          {/* <button type="button">+</button> */}
            </>
          )}

        </FormFields>

        <FormActions>
          <button type="submit" className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
          >
            Submit
          </button>
          <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
           onClick={handleReset}>
            Reset
          </button>
        </FormActions>
      </Form>
    </div>
  )
}












const CaptureWebsiteHistoryTable = ({ tableData, loading, onBack, OnNew }) => {
  // alert(tableData)


  return (
    <>
      <div className="flex justify-end mb-2">
        <button onClick={OnNew}
          className="cursor-pointer px-4 py-1 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2  mr-25 translate-y-2"



        >          New
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tableData.length === 0 ? (

        <div>
          <Table tableTitle="Capture Website History Table" />
        </div>

      ) : (
        <div>
          <Table tableTitle="Capture Website History Table" data={tableData} />
        </div>

      )}
    </>
  );
};

