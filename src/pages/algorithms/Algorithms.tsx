import { Folber, Plus } from '../../assets/svg/SVGcomponent';
import { Button } from '../../components/button';
import styles from './styles.module.scss';
import s from '../configuration/configuration.module.scss';
import { useEffect, useState } from 'react';
import { getAveilableAlgorithms, postUploadAlgorithm } from '../../api/algorithmRequest';
import { useCookies } from 'react-cookie';
import { Preloader } from '../../components/preloader';
import { AlgorithmList } from './components/algorithm.List';
import { Modal } from '../../components/modal';
import { Input } from '../../components/input';
export const Algorithms = () => {
  const [cookies] = useCookies(['token']);
  const [algorithmList, setAlgorithmList] = useState<any>(false);
  const [isShowAddModal, setIsShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const sendAlgorithm = () => {
    postUploadAlgorithm(window.location.hostname, cookies.token, {
      image_name: 'postgres:11',
      name: 'postgres',
      description: description,
      is_available: true,
    }).then((response) => console.log(response));
  };
  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, cookies.token)
      .then((response) => {
        setAlgorithmList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setAlgorithmList([]);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      {isShowAddModal && (
        <Modal className={styles.modal} isOpen={true} handleClose={() => setIsShowAddModal(false)}>
          <div className={styles.modal__container}>
            <div className={styles.modal__content}>
              <h2>Algorithm settings</h2>
              <label>Name</label>
              <Input
                type="text"
                placeholder="Enter Email"
                className="authorization__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id={''}
                name={''}
              />
              <label>Description (optional)0</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              <label>Image</label>
              <Input
                type="text"
                placeholder="Enter Email"
                className="authorization__input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                id={''}
                name={''}
              />
            </div>
            <div className={styles.modal__container_footer}>
              <Button text="Cancel" variant="outlined" onClick={() => setIsShowAddModal(false)} />
              <Button text="Apply" variant="contained" onClick={sendAlgorithm} />
            </div>
          </div>
        </Modal>
      )}
      <Button
        text="Add algorithm"
        className={s.buttonPosition}
        onClick={() => setIsShowAddModal(true)}
        IconLeft={Plus}
      />
      {algorithmList ? (
        algorithmList.length > 0 ? (
          <div className={styles.algorithmList}>
            {algorithmList.map((algorithm: any, index: number) => (
              <AlgorithmList algorithm={algorithm} key={index} token={cookies.token} />
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
