import React from 'react'
import Table from './Table'
import { dummyData } from '../../lib/DummyData'

const DemoDrawerContent = () => {
  return (
    <div>
{/* <h1>
DemoDrawerContent
</h1>

<div>
    <Table data={dummyData}/>
</div> */}
<div className="h-full bg-gray-900 text-white p-4 space-y-4">
  {/* Header */}
  <div className="text-xl font-bold border-b border-gray-700 pb-2">
    sample Side Drawer
  </div>

  {/* Sections */}
  <div className="bg-gray-800 p-4 rounded shadow">
    Section 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
  <div className="bg-gray-700 p-4 rounded shadow">
    Section 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
  <div className="bg-gray-800 p-4 rounded shadow">
    Section 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco.
  </div>
  <div className="bg-gray-700 p-4 rounded shadow">
    Section 4: Duis aute irure dolor in reprehenderit in voluptate velit esse.
  </div>
  <div className="bg-gray-800 p-4 rounded shadow">
    Section 5: Excepteur sint occaecat cupidatat non proident, sunt in culpa.
  </div>
</div>
    </div>
  )
}

export default DemoDrawerContent