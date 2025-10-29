import React, { useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FormController from "../../lib/FormController";
import Form, { FormActions, FormFields } from "../../components/Form";
import TextInput from "../../components/TextInput";
import MultiSelect from "../../components/MultiSelect";
import RadioGroup from "../../components/RadioGroup";
import api from "../../lib/api";

const SetMode = () => {
  const formRef = useRef();
  const deviceRef = useRef();
  const branchRef = useRef();
  const accessRef = useRef();

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
        AddSetMode: async (payload) => {
          return api.createResource("/driveEncryption/AddDriveDetails ", [payload]);
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
            accessRef.current.reset();
            deviceRef.current.reset();
            branchRef.current.reset();
          }, 100);
        },
        onError: (error) => {
          console.error("Submission error:", error);
          toast.error(error.message);
        },

        onBeforeSubmit: (payload) => {
          console.log("Submitting payload:", payload);
          // Add new fields
          payload.requestType = "Set_Mode_Of_Whitelist";

           console.log("Submitting payload:", payload);
        },
      },
    });

    return () => controller.destroy();
  }, []);

  return (
    <div>
      <Form ref={formRef} apiAction="AddSetMode" title="Set Mode">
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
            name="deviceNames"
            data-key="deviceNames"
            label="Host name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName"
            dataDependsOn="branches"
            multiSelect={true}
            sendAsArray={true}
          />

          <MultiSelect
            name="ModeTypes"
            label="Mode Type"
            options={[
              { value: "1", name: "Learning" },
              { value: "0", name: "Protection" },
            ]}
            multiSelect={false}
            sendAsArray={true}
            ref={accessRef}
          />
        </FormFields>

        <FormActions>
          <button
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            type="submit"
          >
            Submit
          </button>
        </FormActions>
      </Form>
    </div>
  );
};

export default SetMode;
