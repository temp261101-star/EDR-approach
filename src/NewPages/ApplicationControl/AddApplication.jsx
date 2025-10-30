import React, { useEffect, useRef, useState } from 'react'
import api from '../../../lib/api';
import FormController from '../../../lib/FormController';
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

          console.log("returned value in addapplication: ", res);

          // Remove all the existing normalization code and just return res
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
    <Form ref={formRef} apiAction="addTrustedApp" title=" Add Trusted Application">
      {/* Inputs */}
      <FormFields grid={2}>
        <MultiSelect
          name="branches"
          label="Branch"
          dataSource="getReactBranchName"
          multiSelect={true}
          sendAsArray={true}
          data-key="branches"
          ref={branchRef}
        />

        <MultiSelect
          name="deviceName"
          label="Device"
          ref={deviceRef}
          dataSource="getReactDeviceOnBranch"
          dataDependsOn="branches"
          data-param="branches"
          data-key="devices"
          multiSelect={true}
          sendAsArray={true}
        />
        <MultiSelect
          name="type"
          label="Type"
          options={[
            { value: "Application Name", name: "Application Name" },
            { value: "Hash", name: "Hash" }
          ]}
          // multiSelect={false}
          onChange={handleApplicationTypeChange}
          required
        />

   
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
          type="reset"
          className="px-5 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
        >
          Submit
        </button>

      </FormActions>
    </Form>





  )
}

export default AddApplication