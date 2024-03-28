import { useState } from 'react';
import {
  deleteAlgorithmAPI,
  putAlgorithmAPI,
  uploadAlgorithm,
} from '../../../api/algorithmRequest';
import { Delete, Download } from '../../../assets/svg/SVGcomponent';
import styles from '../styles.module.scss';
import { Modal } from '../../../components/modal';
import { Button } from '../../../components/button';
import moment from 'moment';
import { Input } from '../../../components/input';
import { DropdownList } from 'react-widgets/cjs';

export const AlgorithmList = ({ algorithm, token, processList, update }: any) => {
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [usedIn, setUsedIn] = useState<string>('');
  const [imageName, setIMageName] = useState<string>(algorithm.image_name);

  const sendAlgorithm = () => {
    putAlgorithmAPI(token, isEdit.id, {
      name: name,
      image_name: imageName,
      is_available: true,
      description: description,
      used_in: usedIn,
    })
      .then((response) => {
        setIsEdit(false);
        update();
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const setIsEditPress = (algorithm: any) => {
    if (
      processList &&
      processList.length > 0 &&
      processList.filter((el: any) => el.algorithm.id === algorithm.id).length === 0
    ) {
      setName(algorithm.name);
      setIsEdit(algorithm);
    }
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

      {isEdit && (
        <Modal className={styles.modal} isOpen={true} handleClose={() => setIsEdit(false)}>
          <div className={styles.modal__container}>
            <div className={styles.modal__content}>
              <h2>Algorithm settings</h2>
              <label>Name</label>
              <Input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id={''}
                name={''}
                className={styles.input}
              />
              <label>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                placeholder="Enter Description"
              />
              <label>Image</label>
              <Input
                type="text"
                placeholder="Enter Image"
                className={styles.input}
                value={imageName}
                onChange={(e) => {
                  console.log(e.currentTarget.value);
                  setIMageName(e.currentTarget.value);
                }}
                id={''}
                name={''}
              />
              <label>Used in</label>
              <DropdownList
                defaultValue={'Dashboard'}
                data={['dashboard', 'inventory', 'orders_view']}
                className={styles.input}
                onChange={(e) => setUsedIn(e.toLowerCase())}
              />
            </div>
            <div className={styles.modal__container_footer}>
              <Button
                text="Cancel"
                className={styles.button_cancel}
                onClick={() => setIsEdit(false)}
              />
              <Button
                text="Apply"
                variant="contained"
                onClick={sendAlgorithm}
                disabled={name.length === 0}
              />
            </div>
          </div>
        </Modal>
      )}
      <div className={styles.containerAlgo__content} onClick={() => setIsEditPress(algorithm)}>
        <h4>{algorithm.name}</h4>
        <span className={styles.containerAlgo__description}>{algorithm.description}</span>
        <div className={styles.containerAlgo__footerInfo}>
          <span className={styles.containerAlgo__image}>image: {algorithm.image_name}</span>
          {algorithm.download_status ? (
            <span>{moment(new Date(algorithm.date_created)).format('DD-MM-YYYY HH:mm:ss')}</span>
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
          <span>Used in {algorithm.used_in} </span>
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
