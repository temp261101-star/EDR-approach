import axios from "axios";
// const api = axios.create({
// // baseURL: "http://192.168.0.203:8181/SecureIT-EDR-ATM/",
// baseURL:"http://182.48.194.218:9191/api/v1",
// // 192.168.0.156:9191/api/v1/dashboard/getDeviceStatus
// });

const api = axios.create({
  baseURL: "/api", // will be rewritten by Vercel
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// test test

async function fetchResource({ resource, parentValue }) {
  console.log("check api endpoint ", resource);
  // console.log("parent key : ", parentValue);
  let r;

  if (parentValue && Object.keys(parentValue).length > 0) {
    r = await api.post(`/${resource}`, parentValue);
    console.log(r.data);
  } else {
    
    r = await api.get(`/${resource}`);
    console.log(r.data);
  }


  

  return r.data;
}

async function createResource(resource, payload) {
  console.log("payload sendt : ", payload);
 
  const r = await api.post(`${resource}`, payload);
  console.log("result of submit ", r);


  console.log(r.data);
  
  return r.data.data ?? r.data;
}







 const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

export const getApi = async (query, endpoint ) => {
  console.log("api call after app render in api ");

  try {
    const encodedQuery = encodeURIComponent(query);

    const res = await api.get(`MITRE_dashboard/${endpoint}?name=${encodedQuery}`);
    console.log("response from api here : ", res);

    return res.data;
  } catch (err) {
    console.error("API fetch failed:", err);
    throw err;
  }
};
export const fetchDataByDateRange = async (endpoint, fromDate, toDate) => {
  console.log(endpoint,fromDate,toDate);
  
  try {
    const response = await api.get(`MITRE_dashboard/${endpoint}`, {
    params: {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),    
      },
    });
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
};
export default {
  fetchResource,
  createResource,
};
