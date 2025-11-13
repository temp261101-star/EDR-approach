import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import FormController from "../../lib/FormController";
import Form, { FormActions, FormFields } from "../../components/Form";
import MultiSelect from "../../components/MultiSelect";
import api from "../../lib/api";
import Table from "../../components/Table";

const SetMode = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data API
  const getDriveDetails = async () => {
    setLoading(true);
    try {
      const res = await api.fetchResource({
        resource: "dashboard/ViewModeListing",
      });
      setTableData(res.data || []);
    } catch (err) {
      toast.error("Failed to load mode data");
    } finally {
      setLoading(false);
    }
  };

  //  Back Button Handler
  const handleBack = () => {
    setShowTable(false);
  };

  return (
    <div className="mt-10">
      {!showTable ? (
        <SetModeForm
          onSuccess={() => {
            setShowTable(true);

            // Load table after submit
            getDriveDetails();
          }}
        />
      ) : (
        <div className="mx-5">
          <ModeTable
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

export default SetMode;

//  FORM COMPONENT

const SetModeForm = ({ onSuccess }) => {
  const formRef = useRef();
  const deviceRef = useRef();
  const branchRef = useRef();
  const accessRef = useRef();

  const [loading, setLoading] = useState(false);

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
          if (Array.isArray(res))
            return res.map((b) => ({ value: b, label: b }));
          if (res?.branches)
            return res.branches.map((b) => ({ value: b.id, label: b.name }));
          return res;
        },
      },

      actions: {
        AddSetMode: async (payload) =>
          api.createResource("/driveEncryption/AddDriveDetails", [payload]),
      },

      hooks: {
        onBeforeSubmit: (payload) => {
          payload.requestType = "Set_Mode_Of_Whitelist";
          setLoading(true);
        },

        onSuccess: () => {
          toast.success("Mode set successfully!");
          setLoading(false);
          setTimeout(() => {
            formRef.current.reset();
            deviceRef.current?.reset();
            branchRef.current?.reset();
            accessRef.current?.reset();
          }, 100);

          onSuccess();
        },

        onError: (err) => toast.error(err.message),
      },
    });

    return () => controller.destroy();
  }, []);
  const reset = () => {
    formRef.current.reset();
    deviceRef.current.reset();
    branchRef.current.reset();
    accessRef.current.reset();
  };
  return (
    <div className="p-4">
      <Form ref={formRef} apiAction="AddSetMode" title="Set Mode">
        <FormFields grid={2}>
          <MultiSelect
            name="branches"
            label="Branch"
            dataSource="commonMode/getBranchName"
            multiSelect
            sendAsArray
            data-key="branches"
            ref={branchRef}
            required
          />

          <MultiSelect
            name="deviceNames"
            data-key="deviceNames"
            label="Host Name"
            ref={deviceRef}
            dataSource="commonMode/getDeviceOnBranchName"
            dataDependsOn="branches"
            multiSelect
            sendAsArray
            required
          />

          <MultiSelect
            name="ModeTypes"
            label="Mode Type"
            options={[
              { value: "Learning", name: "Learning" },
              { value: "Protection", name: "Protection" },
            ]}
            multiSelect={false}
            sendAsArray
            ref={accessRef}
            required
          />
        </FormFields>

        <FormActions>
          <button
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg cursor-pointer"
            type="submit"
          >
            {loading ? <p> loading..</p> : <p>Submit</p>}
          </button>

          <button
            type="button"
            className="px-6 py-2 border rounded-lg ml-2"
            onClick={reset}
          >
            Reset
          </button>
        </FormActions>
      </Form>
    </div>
  );
};

//  TABLE COMPONENT

const ModeTable = ({ tableData, loading, onBack }) => {
  // alert(tableData)
  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 ml-3.5 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-900"
      >
        ← Back
      </button>

      {loading ? (
        <div className="flex justify-center items-center my-28">Loading...</div>
      ) : tableData.length === 0 ? (
        <div>
          <Table tableTitle="Set Mode Table" />
        </div>
      ) : (
        <div>
          <Table tableTitle="Set Mode Table" data={tableData} />
        </div>
      )}
    </>
  );
};
