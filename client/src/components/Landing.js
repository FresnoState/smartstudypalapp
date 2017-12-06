import React from 'react';
import image from '../imgs/bg.jpg';

var styles = {
  height: '91%',
  backgroundImage:
    'linear-gradient(rgba(31, 31, 31, 0.6), rgba(31, 31, 31, 0.6) ), url(' +
    image +
    ')',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
};

const Landing = () => {
  return (
    <div style={styles}>
      <div className="landingCon" style={{ textAlign: 'center' }}>
        <h1>Study Pal!</h1>
        <h5>Connect with peers to study!</h5>
        <i className="material-icons" style={{ fontSize: '5em' }}>
          school
        </i>
      </div>
    </div>
  );
};

export default Landing;
