const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;


const DATA_PATH = "data/groupFlatk.json";
const DEVICES_PATH = "data/devices.json"; 


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

//  GET devices for a specific group
app.get("/api/groups/:id/devices", async (req, res) => {
  const id = req.params.id;
  const allRecords = await readJSON(DATA_PATH);
  
  const groupDevices = allRecords.filter(record => 
    String(record.parentId) === String(id) && record.type === "groupDevice"
  );
  
  res.json(groupDevices);
});

app.listen(PORT, "192.168.0.196", () => {
  console.log(` API running at http://192.168.0.196:${PORT}`);
});


