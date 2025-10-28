import React, { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();


    try {
      const res = await axios.post("http://localhost:8080/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Success:", res.data);
    } catch (err) {
      console.error("Error:", err); 



      
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
}
