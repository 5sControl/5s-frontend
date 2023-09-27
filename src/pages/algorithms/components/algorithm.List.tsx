import { uploadAlgorithm } from '../../../api/algorithmRequest';
import { Download } from '../../../assets/svg/SVGcomponent';
import styles from '../styles.module.scss';
import moment from 'moment';
export const AlgorithmList = ({ algorithm, token }: any) => {
  const downloadAlgorithm = () => {
    uploadAlgorithm(window.location.hostname, token, algorithm.id).then((response) =>
      console.log(response)
    );
  };

  return (
    <div className={styles.containerAlgo}>
      <h4>{algorithm.name}</h4>
      <span className={styles.containerAlgo__description}>{algorithm.description}</span>
      <div className={styles.containerAlgo__footerInfo}>
        <span className={styles.containerAlgo__image}>image: {algorithm.image_name}</span>
        {algorithm.download_status ? (
          //   <span>{moment(algorithm.date_created).format('DD-MM-YYYY')}</span>
          <span>{algorithm.date_created}</span>
        ) : (
          <div className={styles.notDownload}>
            <span>not downloaded</span>
            <Download onClick={downloadAlgorithm} />
          </div>
        )}
        <span></span>
      </div>
    </div>
  );
};
