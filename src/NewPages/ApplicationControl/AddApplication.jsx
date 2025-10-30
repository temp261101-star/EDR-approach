import React, { useEffect, useRef, useState } from 'react'
import api from '../../lib/api';
import FormController from '../../lib/FormController';
import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';
import TextInput from '../../components/FormComponent/TextInput';

const AddApplication = () => {

      const formRef = useRef(null);
  const branchRef = useRef();
  const deviceRef = useRef();
  const [reloadTable, setReloadTable] = useState(0);

  const [showApplicationFields, setShowApplicationFields] = useState(false);

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
        addTrustedApp: async (payload) => {
          return api.createResource("setReactAddApplication", payload);
        },
      },

      hooks: {
        onSuccess: () => {
          // alert("Trusted Application Added!");
          toast.success("Trusted Application Added!");
          formRef.current.reset();
          branchRef.current?.reset();
          deviceRef.current?.reset();
          setShowApplicationFields(false);
          setReloadTable((prev) => prev + 1);
        },
      },
    });

    return () => controller.destroy();
  }, []);

  const handleApplicationTypeChange = (event) => {
    const value = event.target.value;
    setShowApplicationFields(!!value);
  };

  function handleReset() {
    if (formRef.current) {
      formRef.current.reset();
    }
    branchRef.current?.reset();
    deviceRef.current?.reset();
    setShowApplicationFields(false);
  }
  return (
    
       

          <Form 
            ref={formRef}
            apiAction="addTrustedApp"
            title=" Add Trusted Application"
          >
            {/* Inputs */}
            <FormFields grid={2}>
              <MultiSelect
                name="branches"
                label="Branch"
                 dataSource="commonMode/getBranchName"
                
                multiSelect={true}
                sendAsArray={true}
                data-key="branches"
                ref={branchRef}
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
              />

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6"> */}
                 <MultiSelect
                  label="Type"
                  name="type"
                  onChange={handleApplicationTypeChange}
                   options={[
              { value: "Learning", name: "Learning" },
              { value: "Protection", name: "Protection" },
            ]}
                  required
                /> 
            
              {/* </div> */}

      {showApplicationFields && (
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
           

            {/* Buttons */}
            <FormActions>
              
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
              >
                Submit
              </button>

              <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    
                onClick={handleReset}
              >
                Reset
              </button>
           
            </FormActions>
          </Form>

          
     
   
 
  )
}

export default AddApplication