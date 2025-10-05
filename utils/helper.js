exports.formatDate = (date) => {
  if (!date) return 'No due date';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

exports.getStatusColor = (status) => {
  const colors = {
    pending: '#f39c12',
    completed: '#27ae60',
    deleted: '#e74c3c'
  };
  return colors[status] || '#95a5a6';
};