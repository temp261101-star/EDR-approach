import React from 'react'
import CustomTree from './Tree'


function getNodeOptions(node) {
  if (!node.children) {
    // Unique, meaningful options for each leaf node by id/label
    switch (node.id) {
      case 4: // All Updates
        return [
          { label: 'View All Updates', onClick: () => alert('Viewing all updates...') },
          { label: 'Download Updates Report', onClick: () => alert('Downloading updates report...') },
        ];
      case 5: // Critical Updates
        return [
          { label: 'View Critical Updates', onClick: () => alert('Viewing critical updates...') },
          { label: 'Approve All Critical', onClick: () => alert('Approving all critical updates...') },
        ];
      case 6: // Security Updates
        return [
          { label: 'View Security Updates', onClick: () => alert('Viewing security updates...') },
          { label: 'Patch All', onClick: () => alert('Patching all security updates...') },
        ];
      case 7: // Approve Or Decline
        return [
          { label: 'Approve Patch', onClick: () => alert('Patch approved!') },
          { label: 'Decline Patch', onClick: () => alert('Patch declined!') },
        ];
      case 8: // View Patch
        return [
          { label: 'View Patch Details', onClick: () => alert('Viewing patch details...') },
          { label: 'Download Patch', onClick: () => alert('Downloading patch...') },
        ];
      case 9: // Missing Patch
        return [
          { label: 'List Missing Patches', onClick: () => alert('Listing missing patches...') },
          { label: 'Remediate', onClick: () => alert('Remediation started...') },
        ];
      case 11: // All Computers
        return [
          { label: 'View All Computers', onClick: () => alert('Viewing all computers...') },
          { label: 'Assign to Group', onClick: () => alert('Assigning to group...') },
        ];
      case 12: // Unassigned Computers
        return [
          { label: 'List Unassigned', onClick: () => alert('Listing unassigned computers...') },
          { label: 'Assign Now', onClick: () => alert('Assigning now...') },
        ];
      case 13: // Win10
        return [
          { label: 'View Win10 Machines', onClick: () => alert('Viewing Win10 machines...') },
        ];
      case 14: // Win8
        return [
          { label: 'View Win8 Machines', onClick: () => alert('Viewing Win8 machines...') },
        ];
      case 15: // Test
        return [
          { label: 'Test Action', onClick: () => alert('Test action!') },
        ];
      case 16: // Win7
        return [
          { label: 'View Win7 Machines', onClick: () => alert('Viewing Win7 machines...') },
        ];
      case 17: // Windows 10
        return [
          { label: 'View Windows 10', onClick: () => alert('Viewing Windows 10...') },
        ];
      case 18: // omk_test
        return [
          { label: 'OMK Test Action', onClick: () => alert('OMK test action!') },
        ];
      case 19: // Synchronization
        return [
          { label: 'Start Synchronization', onClick: () => alert('Synchronization started!') },
        ];
      case 20: // Downstream
        return [
          { label: 'View Downstream', onClick: () => alert('Viewing downstream...') },
        ];
      default:
        return [
          { label: 'Default Leaf Action', onClick: () => alert('Default leaf!') },
        ];
    }
  }
  // Parent node options
  return [
    { label: 'Edit', onClick: () => alert('Edit ' + node.label) },
    { label: 'Delete', onClick: () => alert('Delete ' + node.label) },
    { label: 'Add Child', onClick: () => alert('Add Child to ' + node.label) },
  ];
}

function BlueDay() {
  return (
    <div><CustomTree getNodeOptions={getNodeOptions} /></div>
  )
}

export default BlueDay