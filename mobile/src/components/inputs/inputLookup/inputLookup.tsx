import { IonLabel, IonItem, IonNote, IonList } from "@ionic/react"
import './inputLookup.scss'

type InputLookupProps = {
    label: string,
    value: string,
    note: string,
    handleNavigateClick: () => void,
}

export const InputLookup: React.FC<InputLookupProps> = ({label, value, note, handleNavigateClick}) => {
    return (
        <div className="inputLookup">
            <IonLabel className="label">{label}</IonLabel>
            <IonItem button onClick={handleNavigateClick}>
                <IonLabel>{value}</IonLabel>
                <IonNote slot="end">{note}</IonNote>
            </IonItem>
        </div>
    )
}