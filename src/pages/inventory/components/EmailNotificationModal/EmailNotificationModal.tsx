import React, { useEffect, useState } from 'react';

import { Modal } from '../../../../components/modal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

import styles from './emailNotification.module.scss';
import { Input } from '../../../../components/input';
import { Button } from '../../../../components/button';
import { selectEditInventoryModal } from '../EditInventoryModal/editInventoryModalSlice';
import { selectInventory, setNotificationInfo } from '../../inventorySlice';
import { companyState } from '../../../company/companySlice';
import { AddPerson } from '../../../../assets/svg/SVGcomponent';
import { SuppliersPopup } from './SuppliersPopup';
import { EMAIL_REGEXP } from '../../../company/config';

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
  const { emailsListHelper, emailNotificationInfo, currentName } = useAppSelector(selectInventory);
  const { companies } = useAppSelector(companyState);
  const [toEmails, setToEmails] = useState<string | null>(emailsListHelper?.join(', ') || null);
  const [copyEmails, setCopyEmails] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [isShowSuppliersTo, setIsShowSuppliersTo] = useState<boolean>(false);
  const [isShowSuppliersCopy, setIsShowSuppliersCopy] = useState<boolean>(false);

  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [toEmailsError, setToEmailsError] = useState<string | null>(null);
  const [copyEmailsError, setCopyEmailsError] = useState<string | null>(null);

  const addSuppliersToEmail = (item: string) => {
    if (toEmails) {
      setToEmails(toEmails + ', ' + item);
    } else {
      setToEmails(item);
    }
  };

  const addSuppliersCopy = (item: string) => {
    if (copyEmails) {
      setCopyEmails(copyEmails + ', ' + item);
    } else {
      setCopyEmails(item);
    }
  };

  const showSuppliersTo = () => {
    setIsShowSuppliersTo(true);
  };

  const hideSuppliersTo = () => {
    setIsShowSuppliersTo(false);
  };

  const showSuppliersCopy = () => {
    setIsShowSuppliersCopy(true);
  };

  const hideSuppliersCopy = () => {
    setIsShowSuppliersCopy(false);
  };

  const onSubmit = () => {
    if (!subject || !subject.length) {
      setSubjectError('Required field');
    }

    const toEmailsData = toEmails?.split(',').map((item) => {
      if (!EMAIL_REGEXP.test(item)) {
        setToEmailsError('Some email is invalid');
      }
      return item.trim();
    });
    const copyEmailsData = copyEmails?.split(',').map((item) => {
      if (!EMAIL_REGEXP.test(item)) {
        setCopyEmailsError('Some email is invalid');
      }
      return item.trim();
    });

    if (subjectError || toEmailsError || copyEmailsError) {
      return;
    }

    const info = {
      to_emails: null as string[] | null,
      copy_emails: null as string[] | null,
      subject: null as string | null,
    };

    if (toEmailsData && toEmailsData[0]) {
      info.to_emails = toEmailsData;
    } else {
      info.to_emails = null;
    }

    if (copyEmailsData && copyEmailsData[0]) {
      info.copy_emails = copyEmailsData;
    } else {
      info.copy_emails = null;
    }

    info.subject = subject || null;

    dispatch(setNotificationInfo(info));

    handleClose();
  };

  useEffect(() => {
    emailNotificationInfo.to_emails && setToEmails(emailNotificationInfo.to_emails.join(', '));
    emailNotificationInfo.copy_emails &&
      setCopyEmails(emailNotificationInfo.copy_emails.join(', '));

    if (isAddItemModal) {
      setSubject(`5S Control Low Stock Alert: ${currentName || '[Item name]'}`);
    } else {
      if (
        emailNotificationInfo.subject?.includes('[Item name]') ||
        !emailNotificationInfo.subject
      ) {
        setSubject(`5S Control Low Stock Alert: ${currentName || currentEditItem?.name}`);
      } else {
        setSubject(emailNotificationInfo.subject);
      }
    }
  }, []);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <h2 className={styles.title}>Email notification</h2>

      <form className={styles.form_container}>
        <div className={styles.input_box} onFocus={() => setToEmailsError(null)}>
          <Input
            id="main"
            name="main"
            type="text"
            label="To"
            value={toEmails || undefined}
            onChange={(e) => setToEmails(e.target.value)}
            className={styles.input}
            placeholder={'Enter recipients divided by comma'}
            errorMessage={toEmailsError}
          />
          <div className={styles.add_supplier} onClick={showSuppliersTo}>
            <AddPerson />
          </div>
          {isShowSuppliersTo && (
            <SuppliersPopup
              companies={companies}
              addSuppliersToEmail={addSuppliersToEmail}
              hideSuppliers={hideSuppliersTo}
            />
          )}
        </div>

        <div className={styles.input_box} onFocus={() => setCopyEmailsError(null)}>
          <Input
            id="copy"
            name="copy"
            type="text"
            label="Copy"
            value={copyEmails || undefined}
            onChange={(e) => setCopyEmails(e.target.value)}
            className={styles.input}
            placeholder={'Enter recipients divided by comma'}
            errorMessage={copyEmailsError}
          />
          <div className={styles.add_supplier} onClick={showSuppliersCopy}>
            <AddPerson />
          </div>
          {isShowSuppliersCopy && (
            <SuppliersPopup
              companies={companies}
              addSuppliersToEmail={addSuppliersCopy}
              hideSuppliers={hideSuppliersCopy}
            />
          )}
        </div>

        <div className={styles.input_box} onFocus={() => setSubjectError(null)}>
          <Input
            id="subject"
            name="subject"
            type="text"
            label="Subject"
            value={subject || undefined}
            onChange={(e) => setSubject(e.target.value)}
            className={styles.input}
            errorMessage={subjectError}
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
