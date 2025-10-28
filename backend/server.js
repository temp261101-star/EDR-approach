

const express = require("express");
const fs = require("fs");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";


app.get("/api/policies", (req, res) => {
  try {
    const allData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    
    const flattened = allData.map(item => ({
      ip: item.ip,
      policyName: item.policyName,
    
      enabled: item.enabled,
      ruleNameType: item.ruleNameType || (item.rule ? item.rule.type : null),
      deviceType: item.deviceType || (item.device ? item.device.type : "usb protection"),
      modeAccess: item.modeAccess || (item.device ? item.device.mode : "Allow"),
      customRuleName: item.customRuleName || (item.rule ? item.rule.name : ""),
      customRuleDescription: item.customRuleDescription || (item.rule ? item.rule.description : ""),
        // description: item.description,
      // defaultPolicy: item.defaultPolicy || (item.network ? item.network.defaultPolicy : ""),
      // networkExclusions: item.networkExclusions || (item.network ? item.network.exclusions : [])
    }));

    return res.json(flattened);
  } catch (error) {
    console.error("Error reading data:", error);
    return res.status(500).json({ error: "Failed to read data" });
  }
});




app.post("/api/policies", (req, res) => {
  try {                                             
    console.log("Request body:", req.body);
    
    const { 
      selectedIPs, 
      policyName, 
      enabled, 
      ruleNameType, 
      customRuleName,
      customRuleDescription,
      deviceType, 
      modeAccess,
      // description,
    } = req.body;                                                 

    let allData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    allData = allData.map(item => {
      if (selectedIPs.includes(item.ip)) {
        // Update based on rule type
        if (ruleNameType === "policy") {
          return {   
            ...item,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            // description,
            enabled,
            ruleNameType,
            customRuleName: customRuleName || "",
            customRuleDescription: customRuleDescription || "",
            deviceType:deviceType || "usb protection",
            modeAccess: modeAccess || "Allow",
          };
        } else if (ruleNameType === "custom") {
          return {
            ...item,  
            policyName,
            // description,
            enabled,
            rule: {
              type: ruleNameType,
              name: customRuleName,
              description: customRuleDescription
            },
            device: {
              type: deviceType,
              mode: modeAccess
            },
          };
        }
      }
      return item;
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2), "utf-8");
    console.log("Data updated successfully");
    return res.json({ message: "Data updated successfully", updatedCount: selectedIPs.length });
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: "Failed to update data" });
  }
});

const PORT = 3000;
app.listen(PORT, '192.168.0.139', () => {
  console.log(`Server running on http://192.168.0.139:${PORT}`);
});