import React, { useEffect, useState } from 'react';

import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

import styles from './emailNotification.module.scss';
import { Input } from '../../../../components/input';
import { Button } from '../../../../components/button';
import { selectEditInventoryModal } from '../EditInventoryModal/editInventoryModalSlice';
import { selectInventory, setNotificationInfo } from '../../inventorySlice';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  isAddItemModal?: boolean;
};

export const EmailNotificationModal: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  isAddItemModal,
}) => {
  const dispatch = useAppDispatch();
  const { currentEditItem } = useAppSelector(selectEditInventoryModal);
  const { emailsListHelper, emailNotificationInfo } = useAppSelector(selectInventory);

  const [toEmails, setToEmails] = useState<string | null>(emailsListHelper?.join(', ') || null);
  const [copyEmails, setCopyEmails] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);

  const onSubmit = () => {
    const toEmailsData = toEmails?.split(',').map((item) => item.trim());
    const copyEmailsData = copyEmails?.split(',').map((item) => item.trim());
    dispatch(
      setNotificationInfo({
        to_emails: toEmailsData || null,
        copy_emails: copyEmailsData || null,
        subject: subject || null,
      })
    );

    handleClose();
  };

  useEffect(() => {
    emailNotificationInfo.to_emails && setToEmails(emailNotificationInfo.to_emails.join(', '));
    emailNotificationInfo.copy_emails &&
      setCopyEmails(emailNotificationInfo.copy_emails.join(', '));

    if (isAddItemModal) {
      setSubject('5S Control Low Stock Alert: [Item name]');
    } else {
      setSubject(
        emailNotificationInfo.subject || `5S Control Low Stock Alert: ${currentEditItem?.name}`
      );
    }
  }, []);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <h2 className={styles.title}>Email notification</h2>

      <form className={styles.form_container}>
        <div className={styles.input_box}>
          <Input
            id="main"
            name="main"
            type="text"
            label="To"
            value={toEmails || undefined}
            onChange={(e) => setToEmails(e.target.value)}
            className={styles.input}
            placeholder={'Enter recipients divided by comma'}
          />
        </div>

        <div className={styles.input_box}>
          <Input
            id="copy"
            name="copy"
            type="text"
            label="Copy"
            value={copyEmails || undefined}
            onChange={(e) => setCopyEmails(e.target.value)}
            className={styles.input}
            placeholder={'Enter recipients divided by comma'}
          />
        </div>

        <div className={styles.input_box}>
          <Input
            id="subject"
            name="subject"
            type="text"
            label="Subject"
            value={subject || undefined}
            onChange={(e) => setSubject(e.target.value)}
            className={styles.input}
          />
        </div>
      </form>

      <div className={styles.mail_body}>
        <h6>Mail body</h6>

        <p>
          Current stock of ‘[Item name]’: [Current stock] ([Used algorithm]).
          <br /> Low stock level of ‘[Item name]’: [Low stock level].
          <br />
          The inventory level of &#39;[Item name]&#39; in your stock has fallen to a low level. This
          means that there are only a limited number of units left in stock and that the item may
          soon become unavailable.
          <br />
          To avoid any inconvenience, we recommend that you take action to replenish your stock of
          &#39;[Item name]&#39; as soon as possible.
          <br />
          <br />
          You are receiving this email because your email account was entered in 5S Control system
          to receive notifications regarding low stock levels of inventory.
          <br /> [Attached photo report]
        </p>
      </div>

      <div className={styles.button_container}>
        <Button
          text="Cancel"
          variant={'text'}
          className={styles.button_cancel}
          type="button"
          onClick={handleClose}
        />
        <Button text="Done" className={styles.button} type="button" onClick={onSubmit} />
      </div>
    </Modal>
  );
};
