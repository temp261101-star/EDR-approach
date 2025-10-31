import React, { useEffect, useRef } from 'react'

import Form, { FormActions, FormFields } from '../../components/Form'

import MultiSelect from '../../components/MultiSelect';
import { DataProvider, useReportData } from '../../context/DataContext';
import DateRangePicker from '../../components/genericTable/DateRangePicker';
import Table from '../../components/Table';
import FormController from '../../lib/FormController';
import api from '../../lib/api';


function ExternalUsbReport() {

     const formRef=useRef();
      const branchRef=useRef();
      const deviceRef=useRef();

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
              ExternalUsbReport: async (payload) => {
                return api.createResource("/setexternalUSB/addExternalUSB", payload);
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
   <Form  ref={formRef} apiAction="ExternalUsbReport" title="External USB Report">

    
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
            name="deviceName"
            label="Host name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName"
            dataDependsOn="branches"
            multiSelect={true}
            sendAsArray={true}
          />
          
            <DateRangePicker/>
      
        </FormFields>

        <FormActions>
          <button
            className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            type="submit" onClick={()=>navigate('/dashboard/viewMode')}
          >
            Submit
          </button> 

           <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        Reset
                    </button>
        </FormActions>
      </Form>
  

     
    </div>
  )
}

export default ExternalUsbReport