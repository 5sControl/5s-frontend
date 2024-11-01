// AddButton.tsx
import React from 'react';
import { IonButton } from '@ionic/react';

type AddButtonProps = {
    handleClick: () => void;
    label: string;
};

const AddButton: React.FC<AddButtonProps> = ({ handleClick, label }) => {
    return (
        <div className="ion-text-end">
            <IonButton 
                fill="clear" 
                onClick={handleClick} 
                style={{ '--padding-start': 0, '--padding-top': 0, 'minHeight': 'auto' }}
            >
                {label}
            </IonButton>
        </div>
    );
};

export default AddButton;