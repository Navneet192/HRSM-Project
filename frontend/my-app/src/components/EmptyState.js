import React from 'react';

export default function EmptyState({ icon = '⊘', title, description }) {
  return (
    <div className="empty-state-block">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}
