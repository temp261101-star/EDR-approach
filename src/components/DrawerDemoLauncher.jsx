import React, { useState } from "react";
import DrawerModal from "../components/DrawerModal";
import DemoDrawerContent from "./DemoDrawerContent.jsx";
import Table from "./Table.jsx";
import { dummyData } from "../lib/DummyData.js";

export default function DrawerDemoLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded shadow cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Open Drawer Demo
      </button>
      <DrawerModal open={open} onClose={() => setOpen(false)} width="40vw">
        <DemoDrawerContent />
{/* <Table  data={dummyData}/> */}
      </DrawerModal>
    </div>
  );
}
