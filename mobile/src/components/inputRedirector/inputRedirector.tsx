import { IonLabel, IonItem, IonNote, IonList } from "@ionic/react"
import './inputRedirector.scss'

type InputRedirectorProps = {
    label: string,
    value: string,
    note: string,
    onSelect: () => void,
}

export const InputRedirector: React.FC<InputRedirectorProps> = ({label, value, note, onSelect}) => {
    return (
        <div className="inputRedirector">
            <IonLabel className="label">{label}</IonLabel>
            <IonItem button onClick={onSelect}>
                <IonLabel>{value}</IonLabel>
                <IonNote slot="end">{note}</IonNote>
            </IonItem>
        </div>
    )
}