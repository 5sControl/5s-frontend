import React, { FC } from 'react';
import styles from './emailNotification.module.scss';
import { Close, PlusPrimary } from '../../../../assets/svg/SVGcomponent';
import { Button } from '../../../../components/button';
import { ContactInfoType } from '../../../company/types';

type PropsType = {
  companies: ContactInfoType[];
  hideSuppliers: () => void;
  addSuppliersToEmail: (item: string) => void;
};

export const SuppliersPopup: FC<PropsType> = ({
  companies,
  hideSuppliers,
  addSuppliersToEmail,
}) => {
  return (
    <div className={styles.suppliers} onMouseLeave={hideSuppliers}>
      <div className={styles.suppliers_title}>
        <h4>Contacts</h4>
        <div onClick={hideSuppliers}>
          <Close className={styles.close} />
        </div>
      </div>

      <div>
        {companies.map((item) => {
          return (
            <div key={item.id} className={styles.suppliers_container}>
              <div>
                <p className={styles.name_company}>{item.name_company}</p>
                <p className={styles.contact_email}>{item.contact_email}</p>
              </div>
              <Button
                text="Add"
                IconLeft={PlusPrimary}
                variant={'text'}
                onClick={() => {
                  item.contact_email && addSuppliersToEmail(item.contact_email);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
