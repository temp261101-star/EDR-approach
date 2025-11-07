import React, { useEffect, useRef } from 'react'


import Form, { FormActions, FormFields } from '../../components/Form'

import MultiSelect from '../../components/MultiSelect';
import { DataProvider, useReportData } from '../../context/DataContext';
import DateRangePicker from '../../components/genericTable/DateRangePicker';
import Table from '../../components/Table';
import DateTimeInput from '../../components/FormComponent/DateTimeInput';
import { useNavigate } from 'react-router-dom';
import FormController from '../../lib/FormController';
import api from '../../lib/api';





function ViewReport() {

    const formRef = useRef();
    const branchRef = useRef();
    const deviceRef = useRef();
    const navigate=useNavigate();

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
                viewBlacklistingREport: async (payload) => {
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
         <div className="mt-10">
            <Form ref={formRef} apiAction="viewBlacklistingREport" title="View Blacklisting Report">


                <FormFields grid={2}>
                    <DateTimeInput
                        name="From"
                        label="From Date"
                        placeholder="Enter the from Date"
                        required
                    />


                    <DateTimeInput
                        name="To"
                        label="To Date"
                        placeholder="Enter the To Date"
                        required
                    />

                    <MultiSelect
                        name="branches"
                        label="Branch Name"
                        dataSource="commonMode/getBranchName"
                        multiSelect={true}
                        sendAsArray={true}
                        data-key="branches"
                        ref={branchRef}
                        required
                    />

                    <MultiSelect
                        name="deviceName"
                        label="Device name"
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
                        type="submit" 
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

export default ViewReport
