import React, { useEffect, useRef } from 'react'

import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';
import FormController from '../../lib/FormController';
import api from '../../lib/api';

function WebsiteBlacklistingForm() {
  const formRef=useRef();
  const branchRef=useRef();
  const deviceRef=useRef();
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
              { value: "Prevent", name: "Prevent" },
              { value: "Allow", name: "Allow" }
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
                    >
                        Reset
                    </button>
        
        </FormActions>


      </Form>
      
    </div>
  )
}

export default WebsiteBlacklistingForm
