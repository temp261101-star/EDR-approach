

import React, { useEffect, useRef } from 'react'

import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormController from '../../lib/FormController';
import api from '../../lib/api';
import { useDispatch } from "react-redux";

import { setViewApplicationResultData } from "../../store/appSlice";

const ViewApplication = () => {
  const formRef = useRef();
  const deviceRef = useRef();
  const branchRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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

          console.log("returned value in view Application: ", res);
          return res;
        },
      },

      actions: {
        viewApplication: async (payload) => {
          return api.createResource("/dashboard/viewApplicationListing", payload);
        },
      },

      hooks: {
        onSuccess: (response) => {
          toast.success("View Application successful");
          dispatch(setViewApplicationResultData(response));
          console.log("check res : ",response);
   
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
            formRef.current.reset();

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
      <Form ref={formRef} apiAction="viewApplication" title="View Application">
        <FormFields grid={2}>


          <MultiSelect
            name="branches"
            label="Branch"
            dataSource="commonMode/getBranchName"
            multiSelect={true}
            sendAsArray={true}
            ref={branchRef}
            required
          />

          <MultiSelect
            name="deviceNames"
            label="Device Name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName"
            dataDependsOn="branches"
            multiSelect={true}
            sendAsArray={true}
            required
          />

        </FormFields>

        <FormActions>
          <button
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            type="submit" onClick={()=>navigate('/dashboard/viewApplication/viewApplicationListing')}
          >
            Submit
          </button> 
                   {/* <button
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            type="submit"
          >
            Submit
          </button> */}
          <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Reset
          </button>
        </FormActions>
      </Form>
    </div>
  )
}

export default ViewApplication;