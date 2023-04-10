import React from 'react';
import logo from '../../../assets/svg/icon.svg';

export const Congratulations = ({ setStage }) => {
  return (
    <div className="main">
      <img src={logo} alt="logo" className="main__logo" />
      <span className="main__span">
        Congratulations! <br />
        You have successfully installed the 5S Control’s Docker and now ready to use it. Complete
        the setup to start.
      </span>
      <button className="main__start" onClick={() => setStage()}>
        Start Setup
      </button>
    </div>
  );
};
