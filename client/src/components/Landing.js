import React from 'react';
import image from '../imgs/bg.jpeg';

var styles = {
  height: '90vh',
  backgroundImage:
    'linear-gradient(rgba(31, 31, 31, 0.8), rgba(31, 31, 31, 0.8) ), url(' +
    image +
    ')',
  borderRadius: '10px'
};

const Landing = () => {
  return (
    <div style={styles}>
      <div className="landingCon" style={{ textAlign: 'center' }}>
        <h1>Study Pal!</h1>
        Connect with peers to study!
      </div>
    </div>
  );
};

export default Landing;
