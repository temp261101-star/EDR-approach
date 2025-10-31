import React, { useEffect, useRef, useState } from 'react'



import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

import MultiSelect from '../../components/MultiSelect'


import Form, { FormActions, FormFields } from '../../components/Form'
import { Check } from 'lucide-react'
import TextInput from '../../components/TextInput'
import CheckBoxGroup from '../../components/FormComponent/CheckBoxGroup'
import FormController from '../../lib/FormController'
import api from '../../lib/api'



function ExternalUsbForm() {
    const branchRef = useRef()
    const formRef = useRef()
    const deviceRef=useRef();
    const accessRef=useRef();
    const typeRef=useRef();
    // const [showAccessOptions, setShowAccessOptions] = useState(false);
    const [showApplicationFields, setShowApplicationFields] = useState("");
    const writeOptions = [
        { value: "WriteModeDeny", label: "Write Mode Deny" },
    ];
    const executeOptions = [
        { value: "executeOptions ", label: "Execute Mode Deny" },
    ];

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
                externalUsb: async (payload) => {
                    return api.createResource("saveAntivirusData", payload);
                },
            },

            hooks: {
                onSuccess: () => {
                    Swal.fire({
                        title: "Added externalUsb Successfully!",
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

    const handleApplicationTypeChange = (event) => {
        const value = event.target.value;

        setShowApplicationFields(event.target.value);
    };
                    
    console.log("showApplicationFields",showApplicationFields)
    return (
        <div>
            <Form ref={formRef} apiAction="externalUsb" title="Branch Wise">
                <FormFields grid={2}>

                    <MultiSelect
                        name="branches"
                        label="Branch Name"
                        dataSource="commonMode/getBranchName"
                        multiSelect={true}
                        sendAsArray={true}
                        ref={branchRef}
                        required
                    />

                    <MultiSelect
                        name="deviceName"
                        label="Device Name"
                        dataSource="commonMode/getDeviceOnBranchName"
                        ref={deviceRef}
                        dataDependsOn="branches"
                        multiSelect={true}
                        sendAsArray={true}
                        required
                    />


                    <MultiSelect
                        label="Device Type"
                        name="deviceType"
                        options={[
                            { value: "MTP", name: "MTP" },
                            { value: "Down", name: "Down" }
                        ]}
                        ref={typeRef}
                        sendAsArray={true}
                        required
                    />

                    <MultiSelect
                        label="Mode of Access"
                        name="modeofaccess"
                        options={[
                            { value: "Allow", name: "Allow" },
                            { value: "Prevent", name: "Prevent" }
                        ]}
                        sendAsArray={false}
                       ref={accessRef}
                        required
                        onChange={handleApplicationTypeChange}
                    />

                    {showApplicationFields =="Allow" && (
                        <>
                            <CheckBoxGroup
                            name="ExecuteOptions"

                                options={executeOptions}


                            />
                            <CheckBoxGroup
                            name="writeOptions"
                                options={writeOptions}

                            />
                        </>
                    )}

                </FormFields>

                <FormActions>
                    <button type="submit" className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
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

export default ExternalUsbForm;