import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function ManageGroup() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName } = location.state || {};

  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    name: '',
    ip: '',
    location: '',
    os: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch current devices in group
  useEffect(() => {
    fetchDevices();
  }, [groupId]);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(
        `http://192.168.0.196:5000/api/groups/${groupId}/devices`
      );
      setDevices(res.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.ip) {
      alert('Device name and IP are required');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://192.168.0.196:5000/api/groups/${groupId}/devices`,
        {
          ...newDevice,
          type: 'groupDevice',
          status: 'Online' // Default status
        }
      );

      // Refresh devices list
      await fetchDevices();
      
      // Reset form
      setNewDevice({
        name: '',
        ip: '',
        location: '',
        os: '',
        branch: ''
      });
      
      alert('Device added successfully!');
    } catch (err) {
      console.error('Error adding device:', err);
      alert('Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to remove this device from the group?')) {
      try {
        await axios.delete(
          `http://192.168.0.196:5000/api/groups/${groupId}/devices/${deviceId}`
        );
        await fetchDevices();
        alert('Device removed successfully!');
      } catch (err) {
        console.error('Error removing device:', err);
        alert('Failed to remove device');
      }
    }
  };

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard/GroupList')}
          className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          ← Back to Groups
        </button>
        <h1 className="text-2xl font-bold">Manage Group: {groupName}</h1>
        <p className="text-gray-400">Group ID: {groupId}</p>
        <p className="text-gray-400 mt-2">Add or remove devices from this group</p>
      </div>

      {/* Add New Device Form */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add New Device to Group</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-2">Device Name *</label>
            <input
              type="text"
              value={newDevice.name}
              onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
              placeholder="Enter device name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">IP Address *</label>
            <input
              type="text"
              value={newDevice.ip}
              onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
              placeholder="Enter IP address"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Location</label>
            <input
              type="text"
              value={newDevice.location}
              onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
              placeholder="Enter location"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Operating System</label>
            <input
              type="text"
              value={newDevice.os}
              onChange={(e) => setNewDevice({...newDevice, os: e.target.value})}
              placeholder="Enter OS"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Branch</label>
            <input
              type="text"
              value={newDevice.branch}
              onChange={(e) => setNewDevice({...newDevice, branch: e.target.value})}
              placeholder="Enter branch"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <button
          onClick={handleAddDevice}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          <Plus size={16} />
          {loading ? 'Adding Device...' : 'Add Device to Group'}
        </button>
      </div>

      {/* Current Devices Table */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">
          Current Devices in Group ({devices.length})
        </h2>

        {devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Device Name</th>
                  <th className="text-left p-3">IP Address</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">OS</th>
                  <th className="text-left p-3">Branch</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(device => (
                  <tr key={device.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-3 font-medium">{device.name}</td>
                    <td className="p-3 font-mono">{device.ip}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'Online' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="p-3">{device.location || '-'}</td>
                    <td className="p-3">{device.os || '-'}</td>
                    <td className="p-3">{device.branch || '-'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        title="Remove from group"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No devices in this group. Add devices using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
}