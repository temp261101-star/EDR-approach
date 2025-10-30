import React, { useEffect, useRef, useState } from 'react'



import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

import MultiSelect from '../../components/MultiSelect'
import FormController from '../../../lib/FormController'
import api from '../../../lib/api'
import Form, { FormActions, FormFields } from '../../components/Form'
import { Check } from 'lucide-react'
import TextInput from '../../components/TextInput'
import CheckBoxGroup from '../../components/FormComponent/CheckBoxGroup'



function ExternalUsbForm() {
    const branchref = useRef()
    const formRef = useRef()
    // const [showAccessOptions, setShowAccessOptions] = useState(false);
    const [showApplicationFields, setShowApplicationFields] = useState(false);
    const writeOptions = [
        { value: "WriteModeDeny", label: "Write Mode Deny" },
    ];
    const executeOptions = [
        { value: "executeOptions ", label: "Execute Mode Deny" },
    ];

    useEffect(() => {
        if (!formRef.current) return;

        const controller = new FormController(formRef.current, {
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

        setShowApplicationFields(!!value);
    };
    return (
        <div>
            <Form ref={formRef} apiAction="externalUsb" title="Branch Wise">
                <FormFields grid={2}>

                    <MultiSelect
                        label="Branch Name"
                        name="branch"
                        options={[
                            { value: "vashi", name: "Vashi" },
                            { value: "Mysore", name: "Mysore" }
                        ]}
                        multiSelect={true}
                        sendAsArray={true}
                        ref={branchref}
                        required
                    />

                    <MultiSelect
                        label="Device Name"
                        name="devicename"
                        options={[
                            { value: "gayathri", name: "Gayathri" },
                            { value: "jyothi", name: "Jyothi" }
                        ]}
                        multiSelect={true}
                        sendAsArray={true}
                        ref={branchref}
                        required
                    />


                    <MultiSelect
                        label="Device Type"
                        name="deviceType"
                        options={[
                            { value: "Up", name: "Up" },
                            { value: "Down", name: "Down" }
                        ]}
                        sendAsArray={true}
                        ref={branchref}
                        required
                    />

                    <MultiSelect
                        label="Mode of Access"
                        name="modeofaccess"
                        options={[
                            { value: "Detect", name: "Detect" },
                            { value: "Prevent", name: "Prevent" }
                        ]}
                        sendAsArray={true}
                        ref={branchref}
                        required
                        onChange={handleApplicationTypeChange}
                    />

                    {showApplicationFields && (
                        <>
                            <CheckBoxGroup
                                options={executeOptions}


                            />
                            <CheckBoxGroup

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