import { useEffect, useRef } from "react";
import Form, { FormActions, FormFields } from "./Form";
import TextInput from "./TextInput";
import FormController from "../../lib/FormController";
import Swal from "sweetalert2";
import api from "../lib/api";
import RadioGroup from "./RadioGroup";
import axios from "axios";
import toast from "react-hot-toast";

function EmailConfig() {
  const formRef = useRef(null);
  const policynameRef = useRef();
  const remarkRef = useRef();
  const hashRef = useRef();
  const filenameRef = useRef();
  const filepathRef = useRef();
  const fileRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    const controller = new FormController(formRef.current, {
      actions: {
        policyConfigApi: async (payload) => {
          return api.createResource("addDeviceCheck", payload);
        },
      },

      hooks: {
        onSuccess: () => {
          Swal.fire({
            title: "Policy Added Successfully!",
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
              confirmButton: "px-4 py-0.5 text-sm",
            },
          });

          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            filepathRef.current?.reset();
            filenameRef.current?.reset();
            hashRef.current?.reset();
            remarkRef.current?.reset();
            policynameRef.current?.reset();
            formRef.current?.reset();
            if (fileRef.current) {
              fileRef.current.value = "";
            }
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

  const handlefileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://192.168.0.63:8080/SecureIT-EDR-ATM/EndPointSecurity/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("PDF uploaded successfully:", res.data);

      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("PDF upload failed:", err);

      toast.error("File upload fail");
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };
  return (
    <div>
      <Form
        ref={formRef}
        apiAction="policyConfigApi"
        title="Policy Configuration"
      >
        <FormFields grid={2}>
          <TextInput
            label="Policy Name"
            name="policyname"
            placeholder="Enter Policy Name"
          />

          <TextInput label="Remark" name="remark" placeholder="Enter Remark" />

          <RadioGroup
            name="selectMode"
            label="Select Mode:"
            error=""
            options={[
              { label: "OEM Wise", value: "oemwise" },
              { label: "Global", value: "global" },
            ]}
            defaultValue="oemwise"
          />
          <br />
          <h2 className="text-md font-medium text-gray-200">Exclusion Items</h2>
          <br />
          <TextInput label="Hash" name="hash" placeholder="Enter Hash" />

          <TextInput
            label="File Name"
            name="filename"
            placeholder="Enter File Name"
          />
          <TextInput
            label="File Path"
            name="filepath"
            placeholder="Enter File Path"
          />

          <br />
          <h2 className="text-md font-medium text-gray-200">file uploader</h2>
          <br />
          <input
            type="file"
            ref={formRef}
            accept="application/pdf"
            className="text-gray-400 font-medium border border-gray-600 px-2.5 py-0.5 rounded-sm"
            onChange={(e) => handlefileUpload(e)}
          />
        </FormFields>
        <FormActions>
          <button
            type="submit"
            className="px-5 py-1 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-sm"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="px-5 py-1 bg-cyan-100 text-gray-800 rounded-lg hover:bg-cyan-200 transition-colors shadow-sm"
          >
            Reset
          </button>
        </FormActions>
      </Form>
    </div>
  );
}

export default EmailConfig;
