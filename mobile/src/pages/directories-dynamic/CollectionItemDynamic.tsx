import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { useState } from "react";
import { dynamicApiSlice, useGetCollectionItemQuery } from "../../store/dynamicApiSlice";
import {  directoriesMeta } from "./Meta";
import Fab from "../../components/fab/Fab";
import { EditWhiteIcon, Plus, TrashBin } from "../../assets/svg/SVGcomponent";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ConfirmationModal } from "../../components/confirmationModal/confirmationModal";
import InputReadonly from "../../components/inputs/inputReadonly/inputReadonly";
import { useAppDispatch } from "../../store";

type RouteParams = {
	collection: string;
	id: string;
};

export const CollectionItemDynamic = () => {
	const history = useHistory();
	const location = useLocation();
	const meta = directoriesMeta
	const { collection, id } = useParams<RouteParams>();
	const { fields } = location.state as { fields: {[key: string]: any} }
	const { data } = useGetCollectionItemQuery({meta, itemId: fields['id']})
	const dispatch = useAppDispatch()
	const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

	const onPressDelete = () => {
		setShowConfirmationModal(true);
	}
	const onPressClose = () => {
		setShowConfirmationModal(false);
	}

	const deleteItem = async () => { 
		await dispatch(
			dynamicApiSlice.endpoints.deleteCollectionItem.initiate({
					  meta: directoriesMeta,
					  itemId: fields['id']
			}))
			history.go(-1)
	}

	const onPressEdit = () => {
		history.push(id + "/update",  { fields })
	 }

	return (
		<IonPage>
			<Header
				title={id}
				backButtonHref={`/dynamic/${collection}`}
				endButton={<IonIcon onClick={onPressDelete} style={{ fontSize: "24px" }} icon={TrashBin}></IonIcon>}
			/>
			<IonContent>
				{data && meta.fields.map(field => {
					if (field.visible === true)  {
						return <InputReadonly key={field.field} label={field.label ?? data[field.field]} value={data[field.field]} />
					}
				})}
				<Fab
					icon={EditWhiteIcon}
					handleFabClick={onPressEdit}
				/>
				<ConfirmationModal
					type="danger"
					isOpen={showConfirmationModal}
					onConfirm={deleteItem}
					onClose={onPressClose}
					title={`${"delete"} "${id}" ?`}
					confirmText={"delete"}
					cancelText={"cancel"}
				/>
			</IonContent>
		</IonPage>
	)
}