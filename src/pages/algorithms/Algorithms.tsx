import { Folber, Plus } from '../../assets/svg/SVGcomponent';
import { Button } from '../../components/button';
import styles from './styles.module.scss';
import s from '../configuration/configuration.module.scss';
import { useEffect, useState } from 'react';
import {
  getAveilableAlgorithms,
  getProcess,
  postUploadAlgorithm,
} from '../../api/algorithmRequest';
import { useCookies } from 'react-cookie';
import { Preloader } from '../../components/preloader';
import { AlgorithmList } from './components/algorithm.List';
import { Modal } from '../../components/modal';
import { Input } from '../../components/input';
import { Notification } from '../../components/notification/notification';

export const Algorithms = () => {
  const [cookies] = useCookies(['token']);
  const [algorithmList, setAlgorithmList] = useState<any>(false);
  const [isShowAddModal, setIsShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [process, setProcess] = useState<any[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [message, setMessage] = useState({status: false, message: ''});

  const sendAlgorithm = () => {
    postUploadAlgorithm(window.location.hostname, cookies.token, {
      name: name,
      image_name: image,
      is_available: true,
      description: description,
    }).then((response) => {
      setIsShowAddModal(false);
    }).catch((error) => {
      setMessage({ status: false, message: 'Unable to save' });
    });
  };

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, cookies.token)
      .then((response) => {
        setAlgorithmList(response.data);
      })
      .catch((error) => {
        setAlgorithmList([]);
      });

    getProcess(window.location.hostname, cookies.token).then((response) => {
      if (response.data) {
        setProcess(response.data);
      }
    });
  }, [isShowAddModal, isUpdate]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage({status: false, message: ''});
      }, 2000);
    }
  }, [message]);

  return (
    <div className={styles.wrapper}>
      {isShowAddModal && (
        <Modal className={styles.modal} isOpen={true} handleClose={() => setIsShowAddModal(false)}>
          {message.message && <Notification status={message.status} message={message.message} />}
          <div className={styles.modal__container}>
            <div className={styles.modal__content}>
              <h2>Algorithm settings</h2>
              <label>Name</label>
              <Input
                type='text'
                placeholder='Enter Name'
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
                placeholder='Enter Description'
              />
              <label>Image</label>
              <Input
                type='text'
                placeholder='Enter Image'
                className={styles.input}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                id={''}
                name={''}
              />
            </div>
            <div className={styles.modal__container_footer}>
              <Button
                text='Cancel'
                className={styles.button_cancel}
                onClick={() => setIsShowAddModal(false)}
              />
              <Button
                text='Apply'
                variant='contained'
                onClick={sendAlgorithm}
                disabled={name.length === 0 || image.length === 0}
              />
            </div>
          </div>
        </Modal>
      )}
      <Button
        text='Add algorithm'
        className={s.buttonPosition}
        onClick={() => setIsShowAddModal(true)}
        IconLeft={Plus}
      />
      {algorithmList ? (
        algorithmList.length > 0 ? (
          <div className={styles.algorithmList}>
            {algorithmList.map((algorithm: any, index: number) => (
              <AlgorithmList
                algorithm={algorithm}
                key={index}
                token={cookies.token}
                processList={process}
                update={() => setIsUpdate(!isUpdate)}
              />
            ))}
          </div>
        ) : (
          <>
            <Folber />
            <span>No algorithms found</span>
          </>
        )
      ) : (
        <Preloader />
      )}
    </div>
  );
};
