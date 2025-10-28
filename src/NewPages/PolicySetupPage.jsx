import React, { useEffect, useRef, useState } from 'react'
import Form, { FormActions, FormFields } from '../components/Form'
import TextInput from '../components/FormComponent/TextInput';
import FormController from '../../lib/FormController';
import Swal from 'sweetalert2';
import api from '../../lib/api';
import MultiSelect from '../components/MultiSelect';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import DateTimeInput from '../components/FormComponent/DateTimeInput';
import { useReportData } from '../context/DataContext';

const PolicySetupPage = () => {
 const navigate = useNavigate();
   const [showNetworkModal, setShowNetworkModal] = useState(false);
 const { setDashboardReportData } = useReportData();
  
// const location = useLocation();
const saved = localStorage.getItem("selectedIPs");

let ips = [];
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    ips = parsed.map((item) => item.ipAddress); // 👈 extract all IPs
    console.log("All IPs:", ips);
  } catch (e) {
    console.error("Invalid JSON in localStorage:", e);
  }
}

    // const ips = location.state?.selectedData?.map((item) => item.ip) || []; 
   
    const selectedData =
  saved?.selectedData ||
  (saved ? JSON.parse(saved) : []);

// const ips = selectedData.map((item) => item.ip);
     console.log("ips : ",ips);
  const [resetCheck, setResetCheck] = useState(false);

  const formRef = useRef();
  const statusRef = useRef();
  const dateRef = useRef();

    function handleReset() {
    if (formRef.current) {
      formRef.current.reset();
    }
    statusRef.current?.reset();
    deviceRef.current?.reset();
    dateRef.current?.reset();
    setSelectedModules([]);
    setResetCheck(true);
    setTimeout(() => setResetCheck(false), 100);
  }

  
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
        console.log("Fetched resource:", res);
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
      getReports: async (payload) => {
        const fullPayload = { ...payload, ips };
        console.log("Final payload:", fullPayload);
        return api.createResource("api/getdroupdownstatus", fullPayload);
      },
    },
    
    hooks: {
      onSuccess: (response) => {
        Swal.fire({
          title: "Form Submitted Successfully!",
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
    console.log("Form submission successful, response:", response);
    setDashboardReportData(response);
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.reset();
          }
          statusRef.current?.reset();
        }, 100);

       
        navigate("/dashboard/virusDashboard");
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

  return () => {
    controller?.destroy?.(); 
  };
}, [ips]);


return (
    <div className='mt-10 '>
<div className='max-w-5xl flex items-center justify-end my-5 m-auto '>
         <button
          onClick={() => setShowNetworkModal(true)}
          className="bg-cyan-600 text-white px-4 py-1.5 rounded-md hover:bg-cyan-500 text-sm"
        >
          View IPs
        </button>

        
</div>


     <Form
        ref={formRef}
        apiAction="getReports"
        title="Create Application User"
      >
        <FormFields grid={2}>
       
          <DateTimeInput
          label="From DateTime"
          name="fromDate"
          required
          ref={dateRef}
          />
          <DateTimeInput
          label="To DateTime"
          name="to_date"
          required
          ref={dateRef}
          />
        
         
            <MultiSelect
                name="status"
                label="Status"
                dataSource="getdroupdownstatus"
                multiSelect={true}
                sendAsArray={true}
                data-key="status"
                ref={statusRef}
              />

        
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
            className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700"
          onClick={handleReset}
          >
            Reset
          </button>
        </FormActions>
      </Form>



{/* ips modal */}
      
     {showNetworkModal && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
    onClick={() => setShowNetworkModal(false)} 
  >
    <div
      className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-4 text-white">
        Selected IP Addresses
      </h3>

      <div className="max-h-60 overflow-y-auto space-y-2">
        {ips.map((ip) => (
          <div
            key={ip}
            className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
          >
            {ip}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowNetworkModal(false)}
        className="mt-4 w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-500"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  )
}
export default PolicySetupPage