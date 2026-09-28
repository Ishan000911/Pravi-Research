export const STATUSES = ['Planned', 'Ordered', 'Received', 'Deployed', 'In Maintenance', 'Retired', 'Disposed'];
export const CATEGORIES = ['Server', 'Network Equipment', 'Laptop', 'Desktop', 'Storage', 'Database', 'Virtual Machine', 'Cloud Resource', 'Security Device', 'Other'];
export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];
export const CRITICALITIES = ['Low', 'Medium', 'High', 'Critical'];
export const TRANSITIONS = {
  Planned: ['Ordered'], Ordered: ['Received'], Received: ['Deployed'],
  Deployed: ['In Maintenance', 'Retired'], 'In Maintenance': ['Deployed'], Retired: ['Disposed'], Disposed: []
};

