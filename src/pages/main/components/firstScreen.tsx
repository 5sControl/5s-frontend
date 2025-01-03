import LogoHorizontal from '../../../assets/svg/5scontrol.svg';
import { HeaderMain } from '../../../components/header';
import { Preloader } from '../../../components/preloader';

import styles from '../main.module.scss';
type PropsType = {
  setStage: () => void;
  isLoading: boolean;
};

export const Congratulations: React.FC<PropsType> = ({ setStage, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className={styles.main}>
          <HeaderMain title=''></HeaderMain>
          <img src={LogoHorizontal} alt='logo' className={styles.main__logo} />
          <span className={styles.main__span}>
            Congratulations! <br />
            You have successfully installed the 5S Control Docker and now ready to use it. Complete
            the setup to start.
          </span>
          <button className={styles.main__start} onClick={setStage}>
            Start Setup
          </button>
        </div>
      )}
    </>
  );
};
