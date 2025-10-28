import Form, { FormActions, FormFields } from "../components/Form";
import TextInput from "../components/TextInput";

export default function ATMs() {
  return (
    // <div className="bg-white p-6 rounded-2xl shadow">
      <Form>
        <FormFields>
          <TextInput
            label="Name"
            name="firstName"
            placeholder="Enter Firstname"
            type="text"
          />
          <TextInput
          label="Name"
            name="lastName"
            placeholder="Enter Lastname"
            type="text"
           />
        </FormFields>
        <FormActions >
         <button
      type="submit"
      className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700"
    >
      Submit
    </button>
    <button
      type="button"
      className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700"
    >
      Reset
    </button>
        </FormActions>
      </Form>
    // </div>
  );
}
