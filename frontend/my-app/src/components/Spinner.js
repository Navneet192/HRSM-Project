import React from 'react';

export default function Spinner({ message = 'Loading…' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-label">{message}</p>
    </div>
  );
}
