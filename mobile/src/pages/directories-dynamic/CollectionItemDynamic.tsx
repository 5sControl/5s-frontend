import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { useCallback, useEffect, useState } from "react";
import { dynamicApiSlice, useGetCollectionItemQuery } from "../../store/dynamicApiSlice";
import { directoriesMeta } from "./Meta";
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
	const meta = directoriesMeta
	const { id } = useParams<RouteParams>();
	const { data, refetch } = useGetCollectionItemQuery({ meta, itemId: id })
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
				itemId: Number(id)
			}))
		history.go(-1)
	}

	const onPressEdit = () => {
		history.push(id + "/update")
	}

  useEffect(() => {
    const unlisten = history.listen(() => {
      refetch();
    });

    return () => {
      unlisten();
    };
  }, [history, refetch]);

	return (
		<IonPage>
			{data && <Header
				title={data[meta.displayField]}
				backButtonHref={`/configuration/${meta.collection}`}
				endButton={<IonIcon onClick={onPressDelete} style={{ fontSize: "24px" }} icon={TrashBin}></IonIcon>}
			/>}
			<IonContent>
				{data && meta.fields.map(field => {
					if (field.visible === true) {
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