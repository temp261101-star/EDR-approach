import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import MultiSelect from "../components/MultiSelect";
import FormController from "../../lib/FormController";
import Form, { FormActions, FormFields } from "../components/Form";
import api from "../../lib/api";
import TextInput from "../components/TextInput";
import ModuleDrawerModal from "./MODAL/ModuleDrawerModal.JSX";
import toast from "react-hot-toast";
// import { Form, FormFields, FormActions } from "../components/Form";

export default function ApplicationUser() {
  const formRef = useRef(null);
  const branchRef = useRef();
  const deviceRef = useRef();

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [resetCheck, setResetCheck] = useState(false);
  const [reloadTable, setReloadTable] = useState(0);

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

          return [];
        },
      },

      actions: {
        addTrustedApp: async (payload) => {
          return api.createResource("saveApplicationData", [payload]);
        },
      },

      hooks: {
        onSuccess: () => {
          Swal.fire({
            title: "Trusted Application User Successfully!",
            icon: "success",
            background: "#1e293b",
            color: "#e2e8f0",
            iconColor: "#4ade80",
            width: "28rem",
            height: "20rem",
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
            branchRef.current?.reset();
            deviceRef.current?.reset();
            setSelectedModules([]);
            setResetCheck(true);
            setTimeout(() => setResetCheck(false), 100);
          }, 100);

          setReloadTable((prev) => prev + 1);
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

  function handleReset() {
    if (formRef.current) {
      formRef.current.reset();
    }
    branchRef.current?.reset();
    deviceRef.current?.reset();
    setSelectedModules([]);
    setResetCheck(true);
    setTimeout(() => setResetCheck(false), 100);
  }

  return (
    <div className="min-h-lh bg-gray-900 p-1.5 ">
      <Form
        ref={formRef}
        apiAction="addTrustedApp"
        title="Create Application User"
      >
        <FormFields grid={3}>
          <TextInput
            label="First Name"
            name="firstName"
            placeholder="Enter First Name"
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            placeholder="Enter Last Name"
            required
          />
          <TextInput
            label="Email ID"
            type="email"
            name="emailID"
            placeholder="Enter Email ID"
            required
          />

          <TextInput
            label="Contact Number"
            name="contactNo"
            placeholder="Enter Contact Number"
            required
          />
          <TextInput
            label="User Name"
            name="userName"
            placeholder="Enter User Name"
            required
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            required
          />
          <TextInput
            label="Confirm Password"
            name="confirmPass"
            placeholder="Confirm Password"
            type="password"
            required
          />

          {/* Independent multiselect */}
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
            label="Host name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName
"
            dataDependsOn="branches"
            multiSelect={true}
            sendAsArray={true}
          />
          
          <div>
            <div>
              <h4 className="text-gray-300 text-xs font-medium mb-1">
                Manage Application User Modules
              </h4>
              <div
                onClick={() => setShowModuleModal(true)}
                className="cursor-pointer px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm"
              >
                Manage Application User Module
              </div>
              <input
                type="hidden"
                name="modules"
                value={JSON.stringify(selectedModules)}
                data-field
              />
            </div>

            <ModuleDrawerModal
              reset={resetCheck}
              isOpen={showModuleModal}
              onClose={() => setShowModuleModal(false)}
              onSave={setSelectedModules}
            />
          </div>
        </FormFields>

        <FormActions>
          <button
            type="submit"
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700"
          >
            Reset
          </button>
        </FormActions>
      </Form>

      {/* </div> */}
      {/* </div> */}
    </div>
  );
}
