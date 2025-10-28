// import { useState } from "react";
// import { dummyData } from "../../lib/DummyData";
// import Table from "../components/Table";
// import GenericDrawerModal from "../components/MODAL/GenericDrawerModal";
// import ModuleDrawerModal from "../components/MODAL/ModuleDrawerModal";


// export default function PolicyChange() {


//     const [selectedData, setSelectedData] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);

 
//   return (
//     <div className="p-6 bg-gray-950 min-h-screen text-white">
//       <h1 className="text-2xl font-bold mb-4">User Management</h1>

//       <button
//       onClick={() => setIsOpen(true)}
//         className="mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white text-sm"
//       >
//          Add New Policy
//       </button>

//       <Table data={dummyData} onSelectionChange={setSelectedData} />
//       {/* <GenericDrawerModal isOpen={isOpen}
//     onClose={() => setIsOpen(false)}></GenericDrawerModal> */}


//     </div>
//   );
// }













import { useEffect, useState } from "react";
import { dummyData } from "../../lib/DummyData";
import Table from "../components/Table";
import GenericPopupModal from "../components/MODAL/GenericPopupModal";
import PolicySetup from "./PolicySetup";

export default function PolicyChange() {
                  
const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetch("http://192.168.0.139:3000/api/policies", {
  method: "GET",
  headers: { "Cache-Control": "no-cache" },
})

      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    // <div className="p-6 bg-gray-950 min-h-screen text-white">
    //   <h1 className="text-2xl font-bold mb-4">User Management</h1>

    //   <button
    //     onClick={handleAddNewPolicy}
    //     className="mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white text-sm"
    //   >
    //     Add New Policy
    //   </button>

    //   <Table data={dummyData} onSelectionChange={setSelectedData} />

    //   <GenericPopupModal
    //     isOpen={isOpen}
    //     onClose={() => setIsOpen(false)}
    //     title="Policy Details"
    //     selectedData={selectedData}
    //   />
    // </div>

    
    <>
    {/* <PolicySetup/> */}

    <Table data={data}  />
    </>
    
  );
}
