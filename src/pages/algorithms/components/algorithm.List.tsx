import { useState } from 'react';
import { deleteAlgorithmAPI, uploadAlgorithm } from '../../../api/algorithmRequest';
import { Delete, Download } from '../../../assets/svg/SVGcomponent';
import styles from '../styles.module.scss';

export const AlgorithmList = ({ algorithm, token, processList }: any) => {
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const downloadAlgorithm = () => {
    uploadAlgorithm(window.location.hostname, token, algorithm.id).then((response) =>
      console.log(response)
    );
  };

  const deleteAlgorithm = () => {
    deleteAlgorithmAPI(window.location.hostname, token, algorithm.id).then((response) =>
      console.log(response)
    );
  };

  return (
    <div className={styles.containerAlgo}>
      <div className={styles.containerAlgo__content}>
        <h4>{algorithm.name}</h4>
        <span className={styles.containerAlgo__description}>{algorithm.description}</span>
        <div className={styles.containerAlgo__footerInfo}>
          <span className={styles.containerAlgo__image}>image: {algorithm.image_name}</span>
          {algorithm.download_status ? (
            //   <span>{moment(algorithm.date_created).format('DD-MM-YYYY')}</span>
            <span>{algorithm.date_created}</span>
          ) : (
            <div className={styles.notDownload}>
              <span>Not downloaded</span>
              <Download onClick={downloadAlgorithm} style={{ color: '#666666' }} />
            </div>
          )}
          <span>
            Used on{' '}
            {processList &&
              processList.length > 0 &&
              processList.filter((el: any) => el.algorithm.id === algorithm.id).length}{' '}
            cameras
          </span>
        </div>
      </div>
      <div className={styles.containerAlgo__trash}>
        <span onClick={deleteAlgorithm}>
          {processList &&
            processList.length > 0 &&
            processList.filter((el: any) => el.algorithm.id === algorithm.id).length === 0 && (
              <Delete />
            )}
        </span>
      </div>
    </div>
  );
};
