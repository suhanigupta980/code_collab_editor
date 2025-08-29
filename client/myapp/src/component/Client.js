import React from 'react';
import Avatar from 'react-avatar';

function Client({ username }) {
  return (
    <div className="d-flex align-items-center mb-2 px-2">
      <Avatar name={username} size="35" round={true} className="me-2" />
      <span className="text-light">{username}</span>
    </div>
  );
}

export default Client;

