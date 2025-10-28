import React, { useState } from "react";

const Example = () => {
  const [count, setCount] = useState(6);
  const onIncrease = ()=>{
    setCount(count+1);
  }
  return (
    <div>
      count : {count}
      { count == 10 ? <p>count is 10</p> : <div>
        <input className="bg-red-700"/>
        <input/>
    
        </div>}

        <button onClick={onIncrease}>increase</button>
    </div>
  );
};

export default Example;
