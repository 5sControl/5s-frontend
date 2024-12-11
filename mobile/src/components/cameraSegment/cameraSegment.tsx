import { IonNote } from "@ionic/react";
import { useState } from "react";
import Select from "../selects/select/Select";
import { Input } from "../inputs/input/Input";
import '../../styles/common.scss';
import CameraTest from "../cameraTest/cameraTest";
import styles from './cameraSegment.module.scss'
import './cameraSegment.module.scss';
import { SelectItem } from "../../models/types/selectItem";
import InputReadonly from "../inputs/inputReadonly/inputReadonly";

type CameraSegmentProps = {
    cameraIP: string,
    isCreateCamera : boolean,
    cameraSelect: any,
    findCameraList: any[],
    password: string,
    userName: string,
    setCameraIP: (text: string) => void,
    applySettings: any,
    isEnabled: boolean,
    cameraName: string,
    setUserName: (text: string) => void,
    setCameraName: (text: string) => void,
    setPassword: (text: string) => void,
    editMode?: boolean
}


const CameraSegment: React.FC<CameraSegmentProps> = ({
    cameraIP,
    isCreateCamera,
    cameraSelect,
    findCameraList,
    password,
    userName,
    setCameraIP,
    applySettings,
    isEnabled,
    cameraName,
    setUserName,
    setCameraName,
    setPassword,
    editMode = false
}) => {
    const [isModalChangePassword, setIsModalChangePassword] = useState(false);

    const selectCameraList: SelectItem[] = findCameraList.map((cameraIp: any) => {
        return {
            id: cameraIp,
            label: cameraIp,
            value: cameraIp
        }
    })

    const handleSelectCamera = (e: any) => {
        setCameraIP(e.target.value);
    };

    return (
        <div className={styles.cameraSegment}>
            <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>
                    Соединение
                </IonNote>
                {
                    editMode 
                    ?
                        <InputReadonly
                            label="IP-адрес камеры"
                            value={cameraIP}
                        />
                    :
                        <Select 
                            label="IP-адрес камеры"
                            value={cameraIP!} 
                            placeholder={'Выберите или введите'} 
                            selectList={selectCameraList} 
                            handleChange={handleSelectCamera}
                        />
                }

                <Input 
                    label="Имя пользователя" 
                    value={userName}
                    required
                    handleChange={(e) => setUserName(e.target.value)}
                    tooltip="Имя пользователя IP-камеры часто является значением по умолчанию, установленным производителем, например «admin» или «root». Обычно эту информацию можно найти в руководстве пользователя устройства или на сайте производителя."
                />
                <Input 
                    label="Пароль" 
                    value={password}
                    type="password"
                    hidePassword={false}
                    required
                    handleChange={(e) => setPassword(e.target.value)}
                    tooltip="Пароль IP-камеры обычно задается пользователем в процессе первоначальной настройки. Если вы забыли пароль, вы можете сбросить его, нажав и удерживая в течение нескольких секунд кнопку сброса на камере. Однако при этом все остальные настройки камеры будут сброшены до значений по умолчанию."
                />
            </div>
            <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>
                    Системные настройки
                </IonNote>
                <Input 
                    label="Отображаемое имя (необязательно)" 
                    value={cameraName}
                    required={false}
                    handleChange={(e) => setCameraName(e.target.value)}
                />
                <CameraTest cameraIP={cameraIP} userName={userName} password={password} />
            </div>
        </div>
    );
};

export default CameraSegment;
