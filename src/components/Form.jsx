// import React, { forwardRef } from "react";

// const Form = forwardRef(function Form({ children, apiAction,grid, ...rest }, ref ) {
//   console.log("grid : ",grid);

//   return (
//     <form
//       ref={ref}
//       data-api={apiAction}
//       className={`p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-${grid} gap-4 mb-6`}
//       {...rest}
//     >
//       {children}
//     </form>
//   );
// });

// export default Form;

import React, { forwardRef } from "react";

const FormFields = ({ children, grid = 4 }) => {
  return (
    <div     
className={`
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-${grid}
      `}
    >
      {children}
    </div>
  );
};
// const FormFields = ({ children, grid = 4 }) => {
//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))`,
//         gap: "1rem",
//       }}
//     >
//       {children}
//     </div>
//   );
// };

const FormActions = ({ children }) => {
  return (
    <div className="col-span-full flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-gray-700">
      {children}
    </div>
  );
};

const Form = forwardRef(function Form(
  { children, apiAction, title, subHeading,classStyle, ...rest },
  ref
) {
  return (

    <div className={`max-w-5xl mx-auto `}  >
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 mx-5 overflow-hidden">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">{title}</h1>
              {subHeading && (
                <p className="text-gray-400 text-sm">{subHeading}</p>
              )}
            </div>
          </div>
        </div>
        <form
          ref={ref}
          data-api={apiAction}
          className={`p-6 space-y-6  my-2 mx-5 rounded-md align-middle ${classStyle}`}
          {...rest}
        >
          {children}
        </form>
      </div>
    </div>
  );
});

export default Form;
export { FormFields, FormActions };
