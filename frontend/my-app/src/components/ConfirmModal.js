import React from 'react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm' }) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-sm">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger"    onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
