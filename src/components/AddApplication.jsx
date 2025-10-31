import React, { useRef, useEffect, useState } from "react";
import Form from "../components/Form";
import Select from "../components/Select";
import FormController from "../../lib/FormController";
import TextInput from "./TextInput";
import MultiSelect from "./MultiSelect";
import Table from "./Table";
import toast from "react-hot-toast";
import api from '../lib/api'

export default function AddApplication() {
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
       
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-5">
            <h1 className="text-2xl font-semibold text-gray-100">
              Add Trusted Application
            </h1>
          </div>

          <Form
            ref={formRef}
            apiAction="addTrustedApp"
            data-api="addTrustedApp"
            className="space-y-6"
          >
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 px-7 pt-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                <Select
                  label="Type"
                  name="type"
                  onChange={handleApplicationTypeChange}
                  required
                >
                  <option value="Application">Application</option>
                </Select>
                <div></div>
              </div>

            {showApplicationFields && (
  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
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
  </div>
)}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 px-6 pb-6">
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
            </div>
          </Form>

          
        </div>
      </div>

      <Table reload={reloadTable} />
    </div>
  );

}
