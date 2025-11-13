import { useEffect, useRef, useState } from "react";
import FormController from "../../lib/FormController";
import api from "../../lib/api";
import toast from "react-hot-toast";

import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import TextInput from "../../components/TextInput";
import RadioGroup from "../../components/RadioGroup";
import Table from "../../components/Table";
import CheckBoxGroup from "../../components/FormComponent/CheckBoxGroup"

const CaptureWebsiteHistoryForm = () => {
    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    //  Back Button Handler
    const handleBack = () => {
        setShowTable(false);
    };

    return (
        <div className="mt-10">
            {!showTable ? (

                <CaptureWebsiteHistoryData
                    onSuccess={(response) => {
                        setShowTable(true);
                        setTableData(response || []);
                    }}
                />

            ) : (
                <div className="mx-5">
                    <CaptureWebsiteHistoryTable
                        tableData={tableData}
                        loading={loading}
                        //  Pass back function
                        onBack={handleBack}
                    />
                </div>
            )}


        </div>
    );
};


export default CaptureWebsiteHistoryForm;

function CaptureWebsiteHistoryData({ onSuccess }) {
    const branchRef = useRef()
    const formRef = useRef()
    const deviceRef = useRef();
    const typeRef = useRef();
    const categoryRef = useRef();
    const [showApplicationFields, setShowApplicationFields] = useState("");
    const [loading, setLoading] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const [customList, setCustomList] = useState([]);

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
                capturewebsitehistory: async (payload) => {
                    return api.createResource("/addApplication/captureWebsiteHistory", [payload]);
                },
            },

            hooks: {
                onSuccess: (response) => {
                    toast.success("Capture Website History Details Fetched Successfully");
                    setLoading(false)
                    setTimeout(() => {
                        if (formRef.current) {
                            formRef.current.reset();
                        }
                        formRef.current.reset();
                        StatusRef.current?.reset();
                        // StatusRef.current?.reset();
                        // VirusRef.current?.reset();
                    }, 100);
                    onSuccess(response.Data)
                },
                onError: (error) => {
                    console.error("Submission error:", error);
                    toast.error(error.message);
                    setLoading(false)
                },

                onBeforeSubmit: (payload) => {
                    payload.requestType = "Capture_Website_History";
                    if (showApplicationFields === "Custom" && customList.length > 0) {
                        payload.customValue = customList;
                    }
                    console.log("Submitting payload:", payload);
                    setLoading(true)
                },
            },
        });

        return () => controller.destroy();
    }, []);

    const handleApplicationTypeChange = (event) => {
        const value = event.target.value;

        setShowApplicationFields(event.target.value);
    };

    console.log("showApplicationFields", showApplicationFields)

    function handleReset() {
        setShowApplicationFields("");

        // Clear inputs manually too
        formRef.current.querySelectorAll("input").forEach(i => (i.value = ""));

        setTimeout(() => {
            formRef.current?.reset();
            branchRef.current?.reset();
            deviceRef.current?.reset();
            typeRef.current?.reset();
        }, 0);
    }
    const handleAddCustomValue = () => {
        if (customValue.trim() === "") return;
        if (!customList.includes(customValue.trim())) {
            setCustomList((prev) => [...prev, customValue.trim()]);
        }
        setCustomValue("");
    };

    const handleRemoveCustomValue = (value) => {
        setCustomList((prev) => prev.filter((v) => v !== value));
    };

    return (
        <div className="mt-10">
            <Form ref={formRef} apiAction="capturewebsitehistory" title="Capture Website History">
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
                        name="deviceNames"
                        label="Device Name"
                        dataSource="commonMode/getDeviceOnBranchName"
                        ref={deviceRef}
                        dataDependsOn="branches"
                        multiSelect={true}
                        sendAsArray={true}
                        required
                    />
                    <RadioGroup
                        name="Mechanism"
                        label="Mechanism"

                        options={[{ value: "Alert", label: "Alert" }]}
                    />


                    <MultiSelect
                        label="Parameter"
                        name="paramter"
                        options={[
                            { value: "All", name: "All" },
                            { value: "Custom", name: "Custom" },


                        ]}
                        ref={typeRef}
                        onChange={handleApplicationTypeChange}
                        required
                    />



                    {/* {showApplicationFields == "Custom" && ( */}
                    <>
                        {/* <MultiSelect
                                name="category"
                                label="Category Name"

                                dataSource="commonMode/getCategoryList"
                                ref={categoryRef}
                                //  dataDependsOn="branches"
                                 
                                multiSelect={true}
                                sendAsArray={true}
                                required
                            />
                            <TextInput
                                name="customValue"
                                label="Custom"
                            /> */}
                        {/* <button type="button">+</button> */}
                    </>
                    {/* ) */}
                    {/* } */}

                    {/* <div style={{ display: showApplicationFields === "Custom" ? "block" : "none" }}>
                        <MultiSelect
                            name="category"
                            label="Category Name"
                            dataSource="commonMode/getCategoryList"
                            ref={categoryRef}
                            multiSelect={true}
                            sendAsArray={true}
                            required={showApplicationFields === "Custom"}
                        />

                        <TextInput
                            name="customValue"
                            label="Custom Value"
                            required={showApplicationFields === "Custom"}
                        />
                    </div> */}

                    <div style={{ display: showApplicationFields === "Custom" ? "block" : "none" }}>
                        <MultiSelect
                            name="category"
                            label="Category Name"
                            dataSource="commonMode/getCategoryList"
                            ref={categoryRef}
                            multiSelect={true}
                            sendAsArray={true}
                            required={showApplicationFields === "Custom"}
                        />

                        {/* Custom input + Add button */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                            <TextInput
                                name="customValue"
                                label="Custom"
                                placeholder="Enter custom value"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomValue}
                                style={{
                                    backgroundColor: "#0891b2",
                                    color: "white",
                                    border: "none",
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                }}
                            >
                                +
                            </button>
                        </div>

                        {/* Show added values as checkboxes */}


{customList.length > 0 && (
  <CheckBoxGroup
    key={customList.join(",")} // 🔥 forces re-render when list changes
    name="customValue"
    label="Custom Values"
    options={customList.map((val) => ({
      label: val,
      value: val,
    }))}
    value={customList} // checked initially
    onChange={(e) => {
      const newValues = e.target.value;
      setCustomList(newValues);
    }}
    grid={2}
  />
)}


                    </div>

                </FormFields>

                <FormActions>
                    <button type="submit" className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                    >
                        {loading ? (<p> loading..</p>) : (<p>Submit</p>)}
                    </button>
                    <button type="button" className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        onClick={handleReset}>
                        Reset
                    </button>
                </FormActions>
            </Form>
        </div>

    )
}



const CaptureWebsiteHistoryTable = ({ tableData, loading, onBack }) => {

    return (
        <>
            <button
                onClick={onBack}
                className="mb-4 px-4 py-2 ml-3.5 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-900"
            >
                ← Back
            </button>

            {loading ? (
                <p>Loading...</p>
            ) : tableData.length === 0 ? (

                <div className='mx-4'>
                    <Table tableTitle="Capture Website History Table" />
                </div>

            ) : (
                <div className='mx-4'>
                    <Table tableTitle="Capture Website History" data={tableData} />
                </div>

            )}
        </>
    );
};