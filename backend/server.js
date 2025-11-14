const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(bodyParser.json());

// helpers to read/write JSON files
const readJSON = async (filePath) => {
  const full = path.join(__dirname, filePath);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    // if file doesn't exist or invalid, return empty array
    return [];
  }
};

const writeJSON = async (filePath, data) => {
  const full = path.join(__dirname, filePath);
  await fs.writeFile(full, JSON.stringify(data, null, 2), "utf8");
};

// GET devices (used by the React table)
app.get("/api/devices", async (req, res) => {
  try {
    const devices = await readJSON("data/devices.json");
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read devices" });
  }
});

// GET all created groups
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await readJSON("data/groups.json");
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read groups" });
  }
});

// GET group by id (optional)
app.get("/api/groups/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const groups = await readJSON("data/groups.json");
    const group = groups.find((g) => String(g.id) === String(id));
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read group" });
  }
});

// POST create group
app.post("/api/groups", async (req, res) => {
  try {
    const payload = req.body;
    console.log("test");
    
    // minimal validation
    if (!payload || !payload.name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const groups = await readJSON("data/groups.json");

    // assign an id (incremental or timestamp)
    const newGroup = {
      id: Date.now(), // simple unique id
      name: payload.name,
      description: payload.description || "",
      devices: payload.devices || [],
      createdAt: new Date().toISOString(),
    };

    groups.push(newGroup);
    await writeJSON("data/groups.json", groups);

    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group" });
  }
});

app.listen(PORT, '192.168.0.196', () => {
  console.log(`API server running on http://192.168.0.196:${PORT}`);
});

