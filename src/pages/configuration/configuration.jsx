import './configuration.scss';

export const Configuration = () => {
  return (
    <section className="configuration">
      <h1 className="configuration__title">Configuration</h1>
      <div className="configuration__license">
        <div className="configuration__license_container">
          <span className="configuration__license_title">License</span>
          <h3 className="configuration__license_count">
            {'0/5'}&nbsp;
            <span className="configuration__license_span">algorithms used</span>
          </h3>
        </div>
        <button className="configuration__button">Upgrade Plan</button>
      </div>
    </section>
  );
};
