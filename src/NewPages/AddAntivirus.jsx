import React, { useEffect, useRef } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FormController from "../../lib/FormController";
import Form, { FormActions, FormFields } from "../components/Form";
import TextInput from "../components/TextInput";
import MultiSelect from "../components/MultiSelect";
import RadioGroup from "../components/RadioGroup";
import api from "../../lib/api";

const AddAntivirus = () => {
  const formRef = useRef();
  const StatusRef = useRef();
  // const VirusRef = useRef();
  const ScanRef = useRef();
  const scannerRef = useRef();
  const scheduleRef = useRef();

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
        addAntiVirus: async (payload) => {
          return api.createResource("saveAntivirusData", payload);
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
            StatusRef.current?.reset();
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
      <Form ref={formRef} apiAction="addAntiVirus" title="Add Antivirus">
        <FormFields grid={2}>
          <TextInput
            label="Antivirus Name"
            name="antivirus_name"
            placeholder="Enter System Name"
            required
          />

          <TextInput
            label="System Name"
            name="system_name"
            placeholder="Enter System Name"
          />
          <TextInput label="Date" name="date" type="date" />
          <TextInput label="IP" name="ip" placeholder="Enter IP" />
          <TextInput
            label="Scan Type"
            name="scan_type"
            placeholder="Enter Scan Type"
          />
          <TextInput label="status" name="status" placeholder="Enter Status" />

          {/* <CheckBoxGroup
            name="selected_scanners"
            label="Select Scanners"
              grid={3}
            options={[
              { label: "CrowdStrike", value: "crowdstrike" },
              { label: "Windows Defender", value: "defender" },
              { label: "McAfee", value: "mcafee" },
              { label: "CrowdStrike", value: "crowdstrike" },
              { label: "Windows Defender", value: "defender" },
              { label: "McAfee", value: "mcafee" },
            ]}
            sendAsArray={true}
            ref={scannerRef}
          /> */}
          {/* <MultiSelect
            name="scan_type"
            label="Scan Type"
            options={[
              { value: "Quick Scan", name: "Quick_Scan" },
              { value: "Custom Scan", name: "Custom_Scan" },
              { value: "Full Scan", name: "Full_Scan" },
            ]}
            data-key="scan_type"
            ref={ScanRef}
          /> */}

          {/* <MultiSelect
            name="status"
            label="Status"
            options={[
              { value: "Completed", name: "Completed" },
              { value: "Running", name: "Running" },
              { value: "Failed", name: "Failed" },
            ]}
            ref={StatusRef}
          /> */}

          {/* <DateTimeInput
  name="scan_schedule"
  label="Schedule Scan"
  required
  ref={scheduleRef}
/> */}

          {/* <RadioGroup
      name="scanner_type"
      label="Select Scanner Type"
      options = {[
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ]}
  grid={4}
      required
      onChange={(e) => console.log("Selected scanner:", e.target.value)}
    /> */}
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

export default AddAntivirus;
