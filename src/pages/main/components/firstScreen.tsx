import logo from '../../../assets/svg/icon.svg';

import styles from '../main.module.scss';
type PropsType = {
  setStage: () => void;
};

export const Congratulations: React.FC<PropsType> = ({ setStage }) => {
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className={styles.main__logo} />
      <span className={styles.main__span}>
        Congratulations! <br />
        You have successfully installed the 5ControlS Docker and now ready to use it. Complete the
        setup to start.
      </span>
      <button className={styles.main__start} onClick={setStage}>
        Start Setup
      </button>
    </div>
  );
};
