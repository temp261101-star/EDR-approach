import React, { useEffect, useRef, useState } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FormController from "../../../lib/FormController";
import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import api from "../../../lib/api";
import { useNavigate } from "react-router-dom";



const WhiteListedApplication = () => {
  const formRef = useRef()
  const branchRef = useRef()
  const deviceRef = useRef()

  const navigate = useNavigate()



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
        view1: async (payload) => {
          return api.createResource("/setexternalUSB/addExternalUSB", payload);
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
    <div>
      <Form ref={formRef} apiAction="view1" title="View Whitelisting Report">
        <FormFields grid={2}>

          <MultiSelect
            name="branche"
            label="Branch Name"
            options={[
              { value: "Vashi", name: "Vashi" },
              { value: "Mysore", name: "Mysore" },
            ]}
            ref={branchRef}
            multiSelect={true}
            sendAsArray={true}
          />

          <MultiSelect
            name="device"
            label="Device Name"
            options={[
              { value: "ISRO", name: "ISRO" },
              { value: "Jyothi", name: "Jyothi" },
            ]}
            ref={branchRef}
            multiSelect={true}
            sendAsArray={true}
          />

        </FormFields>
        <FormActions>
          <button
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            type="submit"
            onClick={() => navigate('/dashboard/whitelistedApplication/WhitelistedApplicationReport')
            }
          >
            Submit
          </button>

          <button
              type="button"
              className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Reset
            </button>

        </FormActions>



      </Form>



    </div>
  )
}

export default WhiteListedApplication