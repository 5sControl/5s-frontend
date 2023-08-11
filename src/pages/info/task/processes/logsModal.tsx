import { CloseCross } from '../../../../assets/svg/SVGcomponent';
import { Modal } from '../../../../components/modal';
import styles from './styles.module.scss';
export const LogsModal = ({ logsArray, close }: any) => {
  return (
    <Modal isOpen={true} handleClose={close} className={styles.fullImage}>
      <section className={styles.fullImage__container}>
        <h1 className={styles.fullImage__header}>
          <span>Logs</span>
          <CloseCross onClick={close} />
        </h1>
        <section className={styles.fullImage__content}>
          {logsArray.map((el: string, index: number) => {
            return <div key={index}>{el}</div>;
          })}
        </section>
      </section>
    </Modal>
  );
};
