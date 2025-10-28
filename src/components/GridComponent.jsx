import React from 'react'

const GridComponent = (grid) => {
    console.log("grid : ",grid);
    
  return (
    <div  className={`p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-${grid} gap-4 mb-6`}></div>
  )
}

export default GridComponent