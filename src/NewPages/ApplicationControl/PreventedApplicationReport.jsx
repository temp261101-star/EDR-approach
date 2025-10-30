import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormController from '../../../lib/FormController';
import Form, { FormActions, FormFields } from '../../components/Form';
import MultiSelect from '../../components/MultiSelect';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

const PreventedApplicationReport = () => {
  const formRef = useRef();
  const branchRef = useRef();
  const deviceRef = useRef();
  const navigate = useNavigate();

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

          console.log('returned value in addapplication: ', res);
          return res;
        },
      },

      actions: {
        PreventedApplication: async (payload) => {
          return api.createResource('/setexternalUSB/addExternalUSB', payload);
        },
      },

      hooks: {
        onSuccess: () => {
          toast.success('PreventedApplicationReport successful');
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.reset();
            }
          }, 100);
        },
        onError: (error) => {
          console.error('Submission error:', error);
          toast.error(error.message);
        },
        onBeforeSubmit: (payload) => {
          console.log('Submitting payload:', payload);
        },
      },
    });

    return () => controller.destroy();
  }, []);

  return (
    <div>
      <Form ref={formRef} apiAction="PreventedApplication" title="Prevented Application">
        <FormFields grid={2}>
          <MultiSelect
            label="Branch Name"
            name="branches"
            multiSelect={true}
            sendAsArray={true}
            ref={branchRef}
            options={[
              { value: 'Learning', name: 'Learning' },
              { value: 'Protection', name: 'Protection' },
            ]}
          />

          <MultiSelect
            label="Device Name"
            name="Device"
            ref={deviceRef}
            multiSelect={true}
            sendAsArray={true}
            options={[
              { value: 'Learning', name: 'Learning' },
              { value: 'Protection', name: 'Protection' },
            ]}
          />

          <FormActions>
            <button
              className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              type="submit"
              onClick={() =>
                navigate('/dashboard/preventedApplicationReport/viewpreventedApplication')
              }
            >
              Submit
            </button>

            <button
              type="button"
              className="px-6 py-2 text-white text-sm font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Reset
            </button>
          </FormActions>
        </FormFields>
      </Form>
    </div>
  );
};

export default PreventedApplicationReport;
