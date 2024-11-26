import { IonItem, IonList } from "@ionic/react";
import { ExcelFile } from "../../assets/svg/SVGcomponent";
import styles from "./file.module.css";

type FileProps = {
  fileName: string;
};

const File = ({ fileName }: FileProps) => {
  return (
    <IonList inset={true}>
      <div className={styles.container}>
        <img src={ExcelFile} alt="File" />
        <span className={styles.name}>{fileName}</span>
      </div>
    </IonList>
  );
};
export default File;
