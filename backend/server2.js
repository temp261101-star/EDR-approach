const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


const DATA_PATH = "data/groupFlatk.json";
const DEVICES_PATH = "data/devices.json"; 

const POLICY_ASSIGNMENTS_PATH ="data/policyAssignments.json";


app.use(cors());
app.use(bodyParser.json());

const readJSON = async (filePath) => {
  const full = path.join(__dirname, filePath);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Error reading file:", full, err.message);
    return [];
  }
};

const writeJSON = async (file, data) => {
  const full = path.join(__dirname, file);
  const temp = full + ".tmp";
  await fs.writeFile(temp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(temp, full);
};



app.get("/api/devices", async (_, res) => {
  const devices = await readJSON(DEVICES_PATH);
  res.json(devices);
});


app.post("/api/devices", async (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming))
    return res.status(400).json({ error: "Invalid payload" });

  const devices = await readJSON(DEVICES_PATH);
  incoming.forEach(device => {
    //to check the data if correct or something is missing 
    const newDevice = {
      id: device.id || Date.now() + Math.random(),
      name: device.name || "Unnamed Device",
      ip: device.ip || "0.0.0.0",
      location: device.location || "Unknown",
      branch: device.branch || "Unknown",
      os: device.os || "Unknown",
      status: device.status || "Unknown",
      ...device
    };
    devices.push(newDevice);
  });

  await writeJSON(DEVICES_PATH, devices);
  res.status(201).json({ message: "Devices added", count: incoming.length });
});

// GET all groups (only parent records)
app.get("/api/groups", async (_, res) => {
  const allRecords = await readJSON(DATA_PATH);
  const groups = allRecords.filter(record => record.parentId === null);
  res.json(groups);
});

// for particular group
app.get("/api/groups/:id", async (req, res) => {
  // console.log("check req : ",req);
  const id = req.params.id;
  const allRecords = await readJSON(DATA_PATH);
  
  const group = allRecords.find(record => String(record.id) === String(id) && record.parentId === null);
  if (!group) return res.status(404).json({ error: "Group not found" });
  
  const groupDevices = allRecords.filter(record => String(record.parentId) === String(id));
  
  
  res.json({
    ...group,
    devices: groupDevices
  });
});


app.post("/api/groups", async (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming) || incoming.length === 0)
    return res.status(400).json({ error: "Invalid payload" });

  const groups = await readJSON(DATA_PATH);
  
  // Check if this is a group creation (has items with type "group")
  const groupRecords = incoming.filter(item => item.type === "group");
  const deviceRecords = incoming.filter(item => item.type === "groupDevice");
  
  if (groupRecords.length === 0) {
    return res.status(400).json({ error: "No group record found" });
  }
  
  // Add group records
  groupRecords.forEach(groupRecord => {
    // Check if group ID already exists
    const existingGroup = groups.find(g => String(g.id) === String(groupRecord.id));
    if (!existingGroup) {
      groups.push(groupRecord);
    }
  });
  
  // Add device records (for group-device relationships)
  deviceRecords.forEach(device => {
    // Create a unique ID for this group-device relationship
    const groupDeviceId = `${device.parentId}-${device.originalDeviceId || device.id}`;
    const existingDevice = groups.find(g => String(g.id) === String(groupDeviceId));
    
    if (!existingDevice) {
      groups.push({
        ...device,
        id: groupDeviceId, // Unique ID for this relationship
      });
    }
  });
  
  await writeJSON(DATA_PATH, groups);
  res.status(201).json({ 
    message: "Groups created successfully", 
    groupCount: groupRecords.length,
    deviceCount: deviceRecords.length 
  });
});

// POST - Create child group
app.post("/api/groups/:parentId/children", async (req, res) => {
  // console.log("check req : ",req);
  const parentId = req.params.parentId;
  const { name, description } = req.body;     
  
  if (!name) {
    return res.status(400).json({ error: "Group name is required" });
  }

  const groups = await readJSON(DATA_PATH);
  
  // Verify parent group exists
  const parentGroup = groups.find(g => String(g.id) === String(parentId) && g.type === "group");
  if (!parentGroup) {
    return res.status(404).json({ error: "Parent group not found" });
  }
  
  // Create child group
  const childGroup = {
    id: Date.now(),
    name,
    description: description || "",
    parentId: parentId,
    createdAt: new Date().toISOString(),
    type: "group"
  };
  
  // Check if group with same name already exists under this parent
  const existingGroup = groups.find(g => 
    g.type === "group" && 
    String(g.parentId) === String(parentId) && 
    g.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existingGroup) {
    return res.status(409).json({ error: "A group with this name already exists under the parent" });
  }
  
  groups.push(childGroup);
  await writeJSON(DATA_PATH, groups);
  
  res.status(201).json({ 
    message: "Child group created successfully",
    group: childGroup
  });
});


// PUT - edit name/description
app.put("/api/groups/:id", async (req, res) => {
  // console.log("check req : ",req);
  const id = req.params.id;
  const { name, description } = req.body;
  const groups = await readJSON(DATA_PATH);
  const index = groups.findIndex((g) => String(g.id) === String(id));
  if (index === -1) return res.status(404).json({ error: "Not found" });

  groups[index] = { ...groups[index], name, description };
  await writeJSON(DATA_PATH, groups);
  res.json(groups[index]);
});

//  DELETE - group or its children
app.delete("/api/groups/:id", async (req, res) => {
  // console.log("check req : ",req);
  const id = req.params.id;
  let groups = await readJSON(DATA_PATH);

  const removeRecursive = (targetId) => {
    const children = groups.filter((g) => String(g.parentId) === String(targetId));
    children.forEach((child) => removeRecursive(child.id));
    groups = groups.filter((g) => String(g.id) !== String(targetId));
  };

  removeRecursive(id);
  await writeJSON(DATA_PATH, groups);
  res.json({ message: "Group and its children deleted" });
});


//  GET all groups with their devices (for tree view)
app.get("/api/all-groups-with-devices", async (_, res) => {

    
  const allRecords = await readJSON(DATA_PATH);
  res.json(allRecords);
});

app.get("/api/groups/:id/devices", async (req, res) => {
  const id = req.params.id;
  const allRecords = await readJSON(DATA_PATH);
  const allDevices = await readJSON(DEVICES_PATH); // Get actual devices
  
  const groupDeviceRelationships = allRecords.filter(record => 
    String(record.parentId) === String(id) && record.type === "groupDevice"
  );
  
  // Join with actual device data
  const groupDevices = groupDeviceRelationships.map(relationship => {
    const actualDevice = allDevices.find(device => 
      String(device.id) === String(relationship.originalDeviceId)
    );
    return {
      ...relationship,
      ...actualDevice 
    };
  });
  const cleanedGroupDevices = groupDevices.map(({ originalDeviceId, parentId,type, ...rest }) => rest);

    console.log("groupDevices",cleanedGroupDevices);

  res.json(cleanedGroupDevices);
});

// GET /api/policies
app.get('/api/policies', (req, res) => {
  // Return list of available policies
  res.json([
    { id: '1', name: 'Security Policy', description: 'Basic security settings' },
    { id: '2', name: 'Firewall Rules', description: 'Network firewall configuration' },
    // Add more policies
  ]);
});
app.post("/api/groups/:groupId/devices", async (req, res) => {
  const groupId = req.params.groupId;
  const deviceData = req.body;

  try {
    const groups = await readJSON(DATA_PATH);
    
    // Verify group exists
    const groupExists = groups.find(g => String(g.id) === String(groupId) && g.type === "group");
    if (!groupExists) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Create a GROUP-DEVICE RELATIONSHIP record, not a new device
    const groupDeviceRelationship = {
      id: `${groupId}-${deviceData.originalDeviceId || deviceData.id}`, // Relationship ID
      originalDeviceId: deviceData.originalDeviceId || deviceData.id, 
      parentId: groupId,
      type: "groupDevice",
      createdAt: new Date().toISOString()
      // Don't include device properties like name, ip, etc.
    };

    // Check if relationship already exists
    const existingRelationship = groups.find(g => 
      String(g.id) === String(groupDeviceRelationship.id)
    );

    if (existingRelationship) {
      return res.status(409).json({ error: "Device already in group" });
    }

    groups.push(groupDeviceRelationship);
    await writeJSON(DATA_PATH, groups);

    res.status(201).json({ 
      message: "Device added to group successfully",
      relationship: groupDeviceRelationship
    });

  } catch (err) {
    console.error("Error adding device to group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/groups/:groupId/devices/:deviceId", async (req, res) => {
  const { groupId, deviceId } = req.params;
  console.log("DELETE request - GroupId:", groupId, "DeviceId:", deviceId);

  try {
    let groups = await readJSON(DATA_PATH);
    
    // Debug: log all group devices for this group
    const groupDevices = groups.filter(g => 
      String(g.parentId) === String(groupId) && 
      g.type === "groupDevice"
    );
    console.log("All devices in this group:", groupDevices.map(d => ({
      id: d.id,
      parentId: d.parentId,
      originalDeviceId: d.originalDeviceId
    })));

    // Find the device
    const deviceIndex = groups.findIndex(g => 
      String(g.id) === String(deviceId) && 
      String(g.parentId) === String(groupId) && 
      g.type === "groupDevice"
    );

    console.log("Found device at index:", deviceIndex);

    if (deviceIndex === -1) {
      return res.status(404).json({ error: "Device not found in group" });
    }

    // Remove the device
    groups.splice(deviceIndex, 1);
    await writeJSON(DATA_PATH, groups);

    res.json({ message: "Device removed from group successfully" });

  } catch (err) {
    console.error("Error removing device from group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// === CONTINUE WITH YOUR EXISTING POLICY ENDPOINTS ===

// GET /api/policies
app.get('/api/policies', (req, res) => {
  // Return list of available policies
  res.json([
    { id: '1', name: 'Security Policy', description: 'Basic security settings' },
    { id: '2', name: 'Firewall Rules', description: 'Network firewall configuration' },
    // Add more policies
  ]);
});

// POST /api/groups/:groupId/deploy-policy
app.post('/api/groups/:groupId/deploy-policy', (req, res) => {
  // console.log("check req : ",req);
  const { policyId, deviceIPs } = req.body;
  
  // Implement your policy deployment logic here
  // This should apply the policy to all specified device IPs
  
  res.json({ success: true, message: 'Policy deployed successfully' });
});

app.listen(PORT, "192.168.0.196", () => {
  console.log(` API running at http://192.168.0.196:${PORT}`);
});
// POST /api/groups/:groupId/deploy-policy
app.post('/api/groups/:groupId/deploy-policy', (req, res) => {
  // console.log("check req : ",req);
  const { policyId, deviceIPs } = req.body;
  
  // Implement your policy deployment logic here
  // This should apply the policy to all specified device IPs
  
  res.json({ success: true, message: 'Policy deployed successfully' });
});




// GET - Get policy assignments for devices
app.get("/api/policy-assignments", async (req, res) => {
  try {
    const assignments = await readJSON(POLICY_ASSIGNMENTS_PATH);
    res.json(assignments);
  } catch (err) {
    console.error("Error reading policy assignments:", err);
    res.json([]);
  }
});

// POST - Assign policy to devices
app.post("/api/policy-assignments", async (req, res) => {
  const { policyId, policyName, deviceIPs, groupId } = req.body;

  try {
    let assignments = await readJSON(POLICY_ASSIGNMENTS_PATH);
    
    const timestamp = new Date().toISOString();
    
    // Update assignments for each device
    deviceIPs.forEach(deviceIP => {
      const existingIndex = assignments.findIndex(a => a.deviceIP === deviceIP);
      
      if (existingIndex !== -1) {
        // Update existing assignment
        assignments[existingIndex] = {
          ...assignments[existingIndex],
          policyId,
          policyName,
          groupId,
          lastUpdated: timestamp
        };
      } else {
        // Create new assignment
        assignments.push({
          deviceIP,
          policyId,
          policyName,
          groupId,
          assignedAt: timestamp,
          lastUpdated: timestamp
        });
      }
    });

    await writeJSON(POLICY_ASSIGNMENTS_PATH, assignments);
    res.json({ message: "Policy assigned successfully", count: deviceIPs.length });
  } catch (err) {
    console.error("Error assigning policy:", err);
    res.status(500).json({ error: "Failed to assign policy" });
  }
});

// GET - Get policy assignments for specific group
app.get("/api/groups/:groupId/policy-assignments", async (req, res) => {
  const { groupId } = req.params;
  
  try {
    const assignments = await readJSON(POLICY_ASSIGNMENTS_PATH);
    const groupAssignments = assignments.filter(a => a.groupId === groupId);
    res.json(groupAssignments);
  } catch (err) {
    console.error("Error reading group policy assignments:", err);
    res.json([]);
  }
});

app.listen(PORT, "192.168.0.196", () => {
  console.log(` API running at http://192.168.0.196:${PORT}`);
});


