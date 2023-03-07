import ClockLoader from 'react-spinners/ClockLoader';

export const Preloader = ({ loading }) => (
  <div className="preloader-wrapper">
    <ClockLoader color="#FE6100" size={150} loading={loading} />
  </div>
);
