import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';

export default function GroupPolicy() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName } = location.state || {};

  const [devices, setDevices] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch devices in this group
      const devicesRes = await axios.get(
        `http://192.168.0.196:5000/api/groups/${groupId}/devices`
      );
      
      // Fetch policy assignments for this group
      const assignmentsRes = await axios.get(
        `http://192.168.0.196:5000/api/groups/${groupId}/policy-assignments`
      );
      const assignments = assignmentsRes.data;

      // Merge devices with their policy assignments
      const devicesWithPolicies = devicesRes.data.map(device => {
        const assignment = assignments.find(a => a.deviceIP === device.ip);
        return {
          ...device,
          appliedPolicy: assignment?.policyName || null,
          lastPolicyUpdate: assignment?.lastUpdated ? 
            new Date(assignment.lastUpdated).toLocaleString() : 'Never'
        };
      });

      setDevices(devicesWithPolicies);

      // Fetch available policies
      const policiesRes = await axios.get('http://192.168.0.196:5000/api/policies');
      setPolicies(policiesRes.data);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [groupId]);

const handleDeployPolicy = async () => {
  if (!selectedPolicy) {
    alert('Please select a policy first');
    return;
  }

  try {
    setDeploying(true);
    
    const selectedPolicyObj = policies.find(p => p.id === selectedPolicy);
    
    // Store policy assignment in backend
    await axios.post(
      `http://192.168.0.196:5000/api/policy-assignments`,
      {
        policyId: selectedPolicy,
        policyName: selectedPolicyObj.name,
        deviceIPs: devices.map(device => device.ip),
        groupId: groupId
      }
    );

    // Update device status in UI
    setDevices(prevDevices => 
      prevDevices.map(device => ({
        ...device,
        appliedPolicy: selectedPolicyObj.name,
        lastPolicyUpdate: new Date().toLocaleString()
      }))
    );

    alert(`Policy "${selectedPolicyObj.name}" deployed successfully to all ${devices.length} devices!`);
    
  } catch (err) {
    console.error('Error deploying policy:', err);
    alert('Failed to deploy policy');
  } finally {
    setDeploying(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold">Apply Policy to Group: {groupName}</h1>
        <p className="text-sm text-gray-400">Group ID: {groupId} • {devices.length} devices</p>
      </div>

<div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
  <h2 className="text-xl font-semibold mb-4">Select Policy to Apply</h2>
  
  <div className="flex items-end gap-4 mb-4">
    <div className="flex-1 max-w-md"> 
      <label className="block text-sm text-gray-400 mb-2">Choose Policy</label>
      <select
        value={selectedPolicy}
        onChange={(e) => setSelectedPolicy(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="">Select a policy...</option>
        {policies.map(policy => (
          <option key={policy.id} value={policy.id}>
            {policy.name} - {policy.description}
          </option>
        ))}
      </select>
    </div>
    
    <button
      onClick={handleDeployPolicy}
      disabled={deploying || !selectedPolicy}
      className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
    >
      <Play size={16} />
      {deploying ? 'Deploying...' : 'Deploy to All Devices'}
    </button>
  </div>
  
  <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
    <p><strong className="text-gray-300">Note:</strong> This will apply the selected policy to all {devices.length} devices in the "{groupName}" group.</p>
    <p className="mt-1.5">All devices will receive the same policy configuration.</p>
  </div>
</div>

      {/* Devices Overview */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">
          Devices that will receive this policy ({devices.length})
        </h2>

        {devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Device Name</th>
                  <th className="text-left p-3">IP Address</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Current Policy</th>
                  <th className="text-left p-3">Last Updated</th>
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
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.appliedPolicy 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {device.appliedPolicy || 'No Policy'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">
                      {device.lastPolicyUpdate || 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No devices in this group. Add devices first from "Manage Group".</p>
          </div>
        )}
      </div>
    </div>
  );
}