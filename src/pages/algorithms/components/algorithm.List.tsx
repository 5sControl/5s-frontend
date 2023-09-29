import { useState } from 'react';
import { deleteAlgorithmAPI, uploadAlgorithm } from '../../../api/algorithmRequest';
import { Delete, Download } from '../../../assets/svg/SVGcomponent';
import styles from '../styles.module.scss';
import { Modal } from '../../../components/modal';
import { Button } from '../../../components/button';
import moment from 'moment';

export const AlgorithmList = ({ algorithm, token, processList, update }: any) => {
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const downloadAlgorithm = () => {
    uploadAlgorithm(window.location.hostname, token, algorithm.id).then((response) =>
      console.log(response)
    );
  };

  const deleteAlgorithm = () => {
    deleteAlgorithmAPI(window.location.hostname, token, algorithm.id).then((response) => {
      setIsRemove(false);
      update();
    });
  };

  return (
    <div className={styles.containerAlgo}>
      {isRemove && (
        <Modal isOpen={true} handleClose={() => setIsRemove(false)} className={styles.remove}>
          <div className={styles.remove__container}>
            <div>
              <h4>Remove an algorithm?</h4>
              <span>You will no longer get reports from this algorithm.</span>
            </div>
            <div className={styles.remove__footer}>
              <Button
                text="Cancel"
                className={styles.button_cancel}
                onClick={() => setIsRemove(false)}
              />
              <Button
                className={styles.remove__footer_del}
                text="Remove"
                variant="contained"
                onClick={deleteAlgorithm}
              />
            </div>
          </div>
        </Modal>
      )}
      <div className={styles.containerAlgo__content}>
        <h4>{algorithm.name}</h4>
        <span className={styles.containerAlgo__description}>{algorithm.description}</span>
        <div className={styles.containerAlgo__footerInfo}>
          <span className={styles.containerAlgo__image}>image: {algorithm.image_name}</span>
          {algorithm.download_status ? (
            <span>{moment(new Date()).format('DD-MM-YYYY HH:mm:ss')}</span>
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
        <span onClick={() => setIsRemove(true)}>
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
