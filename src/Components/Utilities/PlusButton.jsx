// PlusButton.js
import React from 'react';

const PlusButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={styles.button}>
      +
    </button>
  );
};

const styles = {
  button: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    lineHeight: '1',
  },
};

export default PlusButton;
