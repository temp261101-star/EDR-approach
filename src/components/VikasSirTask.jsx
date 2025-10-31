import React, { useRef, useEffect } from "react";
// import Form, { FormActions, FormFields } from "./Form";
import TextInput from "./TextInput";
import FormController from "../../lib/FormController";
import api from "../lib/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Form, { FormActions, FormFields } from "./Form";

const VikasSirTask = () => {
  const formRef = useRef(null);
  const cityRef = useRef();
  const stateRef = useRef();
  const districtRef = useRef();
  const locationRef = useRef();

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



          return [];
        },
      },

      actions: {
        vikasSiApi: async (payload) => {
          return api.createResource("addDeviceCheck", payload);
        },
      },

      hooks: {
        onSuccess: () => {
                    Swal.fire({
            title: "Form Added Successfully!",
            icon: "success",
            background: "#1e293b",
            color: "#e2e8f0",
            iconColor: "#4ade80",
            width: "28rem",
            
            padding: "1.25rem",
            confirmButtonText: "OK",
            confirmButtonColor: "#3b82f6",
            customClass: {
              popup: "rounded-xl shadow-2xl",
              title: "text-lg font-sm ",
              confirmButton: "px-4 py-0.5 text-sm"
            }
          });

          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            stateRef.current?.reset();
            cityRef.current?.reset();
            districtRef.current?.reset();
            locationRef.current?.reset();
           
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
      <Form
        ref={formRef}
        apiAction="vikasSiApi"
        title="Create Application User"
        
      >
        <FormFields grid={2}>
          <TextInput
            label="State"
            name="State"
            placeholder="Enter state name"
            required
          />

          <TextInput label="City" name="city" placeholder="Enter city name" />

          <TextInput
            label="District"
            name="District"
            placeholder="Enter District name"
          />

          <TextInput
            label="Location"
            name="Location"
            placeholder="Enter Location name"
          />
        </FormFields>

        <FormActions>
          <button className="px-5 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors">
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
    </div>
  );
};

export default VikasSirTask;
