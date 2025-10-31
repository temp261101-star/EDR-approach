import React, { useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FormController from "../lib/FormController";
import api from "../lib/api";
import Form, { FormActions, FormFields } from "../components/Form";
import MultiSelect from "../components/MultiSelect";

const AddExternalUSB = () => {
  const formRef = useRef();
  const StatusRef = useRef();
  const accessRef = useRef();
  const branchRef = useRef();
  const hostRef = useRef();
  const deviceTypeRef = useRef();


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
        AddExternalUSB: async (payload) => {
          return api.createResource("/setexternalUSB/AddExternalUSB", payload);
        },
      },

      hooks: {
        onSuccess: () => {
          Swal.fire({
            title: "Added AntiVirus Successfully!",
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
            branchRef.current?.reset();
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


  return (
    <div className="mt-10">
      <Form ref={formRef} apiAction="AddExternalUSB" title="Add External USB">
        <FormFields grid={2}>
          <MultiSelect
            name="ipaddress"
            label="Branch Name"
            options={[
              { value: "ISRO", name: "ISRO" },
              { value: "PRATHAMESH-B", name: "PRATHAMESH-B" },
            ]}
            data-key="ipaddress"
            ref={branchRef}
            multiSelect={true}
          />

          <MultiSelect
            name="hostname"
            label="Device Name"
            options={[
              { value: "DESKTOP-CMCFJIQ (Up)", name: "DESKTOP-CMCFJIQ (Up)" },
              { value: "PRATHAMESH-B", name: "PRATHAMESH-B" },
            ]}
            ref={hostRef}
          />

          <MultiSelect
            name="deviceType"
            label="Device Type"
            options={[
              { value: "ALL", name: "ALL" },
              { value: "MTP", name: "MTP" },
              { value: "USB", name: "USB" },
              { value: "CD/DVD", name: "CD/DVD" },
            ]}
            ref={deviceTypeRef}
          />

          <MultiSelect
            name="modeOfAccess"
            label="Mode Of Access"
            options={[
              { value: "Allow", name: "Allow" },
              { value: "Write", name: "Write" },
              { value: "Read/Write", name: "Read/Write" },
            ]}
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

export default AddExternalUSB;
