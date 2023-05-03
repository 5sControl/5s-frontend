import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5';

import { getAveilableAlgorithms, getProcess } from '../../../api/algorithmRequest';

import { getSelectedCameras } from '../../../api/cameraRequest';
import { Back } from '../../../assets/svg/SVGcomponent';

import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';

import { Preloader } from '../../../components/preloader';
import { CameraSettings } from '../../camera/modal/cameraSettings';

import './camera-config.scss';

export const ConfigurationCamera = () => {
  const [camera, setCamera] = useState({});
  const [algorithm, setAlgorithm] = useState({});
  // const [algorithmList, setAlgorithmList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [cookie] = useCookies(['token']);
  const navigate = useNavigate();
  const location = useParams();

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookie.token).then((res) => {
      const cameraResponse = res.data.filter((camera) => camera.id === location.camera)[0];
      setCamera(cameraResponse);
      getProcess(window.location.hostname, cookie.token).then((res) => {
        // console.log(res);
        setAlgorithm(res.data.filter((process) => process.camera.id === cameraResponse.id));
        setIsShowModal(true);
      });
    });
  }, [isShowModal]);

  return (
    <>
      {Object.keys(camera).length > 0 ? (
        <section className="camera-config"></section>
      ) : (
        <Preloader loading={true} />
      )}
      {isShowModal && (
        <CameraSettings
          IPCamera={camera.id}
          nameCamera={camera.name}
          token={cookie.token}
          setIsCameraSettings={(e) => setIsShowModal(e)}
        />
      )}
    </>
  );
};
