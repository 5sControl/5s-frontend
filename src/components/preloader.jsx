import ClockLoader from 'react-spinners/ClockLoader';
import Gorilla from '../assets/gif/gorila.gif';
export const Preloader = ({ loading }) => (
  <div className="preloader-wrapper">
    <img src={Gorilla} alt="" />
  </div>
);
