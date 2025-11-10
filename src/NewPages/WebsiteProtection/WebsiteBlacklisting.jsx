// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// import Table from '../../components/Table';

// function WebsiteBlacklisting() {
//    const navigate = useNavigate();

//   // Table data
//   const data = [
//     {
//       delete: '🗑️',
//       srNo: 1,
//       pcName: 'DESKTOP-CMCFJIQ',
//       aliasName: 'DESKTOP-CMCFJIQ',
//       branchName: 'NA',
//       deviceType: 'usb',
//       modeOfAccess: 'prevent',
//     },
//   ];

// return (
//   <div className="p-4">

//     <div className="mb-4">

//       <div className="flex justify-end mb-2">
//         <button
//               className="cursor-pointer px-4 py-2 rounded-md bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mr-25 translate-y-2"

//           onClick={() => navigate('/dashboard/WebsiteBlacklist/WebsiteBlacklistForm')}
//         >
//           New
//         </button>
//       </div>

//       {/* Table Section */}
//       <Table data={data}  showCheckboxes={false} />
//     </div>
//   </div>
// );



// }

// export default WebsiteBlacklisting



import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Table from "../../components/Table";
import FormController from "../../lib/FormController";
import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";


const WebsiteBlacklisting = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const handleNewForm = () => {
    setShowForm(true);
  };

  // const handleBack = () => {
  //   setShowForm(false); // show table again
  // };

  const getExternalUsbList = async () => {
    console.log("hyy")
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "usb/getListingRestrictExternalDevice",
      });
      setTableData(res.data.recentFileData || []);
    } catch (err) {
      toast.error("Failed to load website blacklisting data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getExternalUsbList();
  }, []);
  return (
    <div className="mt-10 mx-5">
      {!showForm ? (
        <WebsiteBlacklistingTable
          tableData={tableData}
          loading={loading}
          OnNew={handleNewForm}

        />
      ) : (
        <WebsiteBlacklistingForm
          onSuccess={() => {
            setShowForm(false);
          }}

        />
      )}
    </div>
  );
};

export default WebsiteBlacklisting;

function WebsiteBlacklistingForm() {
  const formRef = useRef();
  const branchRef = useRef();
  const deviceRef = useRef();
  const accessRef = useRef();
  const webRef = useRef();

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
          return api.createResource("/setexternalUSB/addExternalUSB", payload);
        },
      },

      hooks: {
        onSuccess: () => {
          toast.success("Set mode successful");

          //  to do ->   add navigation
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            formRef.current.reset();

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
  const reset = () => {

    formRef.current.reset();
    deviceRef.current.reset();
    branchRef.current.reset();
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
            name="deviceName"
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
            name="access"
            ref={accessRef}
            options={[
              { value: "Allow", name: "Allow" },
              { value: "Prevent", name: "Prevent" },


            ]}
            required


          />

          <MultiSelect

            label="Website Name"
            name="websitename"
            ref={webRef}
            multiselect={true}
            sendAsArray={true}
            // dataSource="getDeviceOnBranchName"
            required
          />

        </FormFields>

        <FormActions>
          <button
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            type="submit"
          >
            Submit
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
const WebsiteBlacklistingTable = ({ tableData, loading, onBack, OnNew }) => {
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
          <Table tableTitle="Website Blacklisting Table" />
        </div>

      ) : (
        <div>
          <Table tableTitle="Website Blacklisting Table" data={tableData} />
        </div>

      )}
    </>
  );
};

