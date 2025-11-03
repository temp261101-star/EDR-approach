// import React, { useEffect, useRef, useState } from 'react'
// import api from '../../lib/api';
// import FormController from '../../lib/FormController';
// import Form, { FormActions, FormFields } from '../../components/Form';
// import MultiSelect from '../../components/MultiSelect';
// import TextInput from '../../components/FormComponent/TextInput';

// const AddApplication = () => {

//   const formRef = useRef(null);
//   const branchRef = useRef();
//   const deviceRef = useRef();
//   const typeRef = useRef();
//   const [reloadTable, setReloadTable] = useState(0);

//   const [showApplicationFields, setShowApplicationFields] = useState("");

//   useEffect(() => {
//     if (!formRef.current) return;

//     const controller = new FormController(formRef.current, {

//       sources: {
//         fetchResource: async ({ resource, parentKey, parentValue }) => {
//           const res = await api.fetchResource({
//             resource,
//             parentKey,
//             parentValue,
//           });
//           if (Array.isArray(res)) {
//             return res.map((branch) => ({
//               value: branch,
//               label: branch,
//             }));
//           }
//           if (res?.branches) {
//             return res.branches.map((b) => ({
//               value: b.id,
//               label: b.name,
//             }));
//           }

//           console.log("returned value in addapplication: ", res);
//           return res;
//         },
//       },
//       actions: {
//         addTrustedApp: async (payload) => {
//           return api.createResource("commonMode/add-application-set", [payload]);
//         },
//       },

//       hooks: {
//        onSuccess: () => {

//   toast.success("Trusted Application Added!");

//   // FIRST unmount fields
//   setShowApplicationFields("");

//   // AFTER a tiny delay, reset form elements
//   setTimeout(() => {
//     formRef.current?.reset();
//     branchRef.current?.reset();
//     deviceRef.current?.reset();
//     typeRef.current?.reset();
//   }, 0);

//   setReloadTable(prev => prev + 1);
// }

//       },
//     });

//     return () => controller.destroy();
//   }, []);

//     const handleApplicationTypeChange = (event) => {
//         const value = event.target.value;

//         setShowApplicationFields(event.target.value);
//     };

//   function handleReset() {
//   setShowApplicationFields("");

//   setTimeout(() => {
//     formRef.current?.reset();
//     branchRef.current?.reset();
//     deviceRef.current?.reset();
//   }, 0);
// }
 
//   return (

//     <div className="mt-10">

//       <Form
//         ref={formRef}
//         apiAction="addTrustedApp"
//         title=" Add Trusted Application"
//       >
//         {/* Inputs */}
//         <FormFields grid={2}>
//           <MultiSelect
//             name="branches"
//             label="Branch"
//             dataSource="commonMode/getBranchName"

//             multiSelect={true}
//             sendAsArray={true}
//             data-key="branches"
//             ref={branchRef}
//             required
//           />

//           <MultiSelect
//             name="deviceName"
//             label="Device"
//             ref={deviceRef}
//             dataSource="commonMode/getDeviceOnBranchName"
//             dataDependsOn="branches"
//             data-param="branches"
//             data-key="devices"
//             multiSelect={true}
//             sendAsArray={true}
//             required
//           />

//           {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6"> */}
//           <MultiSelect
//             label="Type"
//             name="type"
//             ref={typeRef}
//             onChange={handleApplicationTypeChange}
//             options={[
//               { value: "SelectType", name: "Select type" },
//               { value: "ApplicationName", name: "Application Name" },


//             ]}
//             required
//           />

//           {/* </div> */}

//           {showApplicationFields == "ApplicationName" && (
//             <>
//               <TextInput
//                 label="Application Name"
//                 name="applicationName"
//                 placeholder="Enter Application Name"
//                 required
//               />
//               <TextInput
//                 label="Hash (SHA-256)"
//                 name="hash"
//                 placeholder="Enter Hash (SHA-256)"
//                 required
//               />
//             </>
//           )}


//         </FormFields>


//         {/* Buttons */}
//         <FormActions>

//           <button
//             type="submit"
//             className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
//           >
//             Submit
//           </button>

//           <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"

//             onClick={handleReset}
//           >
//             Reset
//           </button>

//         </FormActions>
//       </Form>

//     </div>



//   )
// }

// export default AddApplication








import React, { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';
import FormController from '../../lib/FormController';
import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';
import TextInput from '../../components/FormComponent/TextInput';
import toast from 'react-hot-toast';
// import { toast } from 'react-toastify';

const AddApplication = () => {
  const formRef = useRef(null);
  const branchRef = useRef();
  const deviceRef = useRef();
  const typeRef = useRef();

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

          return res;
        },
      },

      actions: {
        addTrustedApp: async (payload) => {
          return api.createResource("commonMode/add-application-set", [payload]);
        },
      },

      hooks: {
        onSuccess: () => {
          toast.success("Trusted Application Added!");

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

          setReloadTable(prev => prev + 1);
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
      <Form ref={formRef} apiAction="addTrustedApp" title="Add Trusted Application">
        <FormFields grid={2}>
          <MultiSelect
            name="branches"
            label="Branch"
            dataSource="commonMode/getBranchName"
            multiSelect={true}
            sendAsArray={true}
            data-key="branches"
            ref={branchRef}
            required
          />

          <MultiSelect
            name="deviceName"
            label="Device"
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
              { value: "", name: "Select type" },
              { value: "ApplicationName", name: "Application Name" },
            ]}
            required
          />

          {showApplicationFields === "ApplicationName" && (
            <>
              <TextInput
                label="Application Name"
                name="applicationName"
                placeholder="Enter Application Name"
                required
              />
              <TextInput
                label="Hash (SHA-256)"
                name="hash"
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
            Submit
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

export default AddApplication;
