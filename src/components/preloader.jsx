import ClockLoader from 'react-spinners/ClockLoader';

export const Preloader = ({ loading }) => (
  <div className="preloader-wrapper">
    <ClockLoader color="#FE6100" size={120} loading={loading} />
  </div>
);
