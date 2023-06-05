import { FC, useEffect } from 'react';
import { Button } from '../../../components/button';
import { Plus } from '../../../assets/svg/SVGcomponent';

export const Contacts: FC = () => {
  return (
    <>
      <div className="contacts">
        <div className="cameras__title">
          <h2>Contacts</h2>
          <Button
            text="Add Contact"
            onClick={() => {
              console.log('d');
            }}
            IconLeft={Plus}
          />
        </div>
      </div>
    </>
  );
};
