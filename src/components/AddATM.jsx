import React, { useRef, useEffect } from "react";
import Form, { FormFields } from "../components/Form";
import Select from "../components/Select";
import FormController from "../../lib/FormController";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function AddATM() {
  const formRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    const controller = new FormController(formRef.current, {
      // sources: {
      //   fetchResource: async ({ resource, parentKey, parentValue }) => {
      //     return api.getResource(resource, parentKey, parentValue);
      //   },
      // },

      sources: {
        deviceTypes: api.getDeviceTypes,
        state: api.getStates,
        cities: async ({ state }) => {
          console.log("frontend param:", state);
          return api.getCities(state);
        },
        region: api.getRegions,
        branches: api.getBranch,
      },
      actions: {
        addATM: async (payload) => api.post("/atms", payload),
      },
      hooks: {
        onSuccess: () => {
          // alert("ATM Added!");
          toast.success("ATM Added !");
          formRef.current.reset();
        },
      },
    });

    return () => controller.destroy();
  }, []);

  return (
    <Form ref={formRef} apiAction="addATM" data-api="addATM" title="Add Atm">
      <FormFields grid={2}>
        <Select
          name="state"
          label="state"
          data-source="state"
          data-auto="state"
        />

        <Select
          label="City"
          name="city"
          data-source="cities"
          data-depends-on="state"
          required
        />

        <Select
          label="Branch"
          name="branch"
          data-source="branches"
          data-depends-on="city"
          required
        />
      </FormFields>
      
    </Form>
  );
}
