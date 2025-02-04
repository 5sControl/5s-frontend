import { IonContent, IonPage } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { directoriesMeta } from "./Meta";
import i18n from "../../i18";
import { Input } from "../../components/inputs/input/Input";
import BottomButton from "../../components/bottomButton/BottomButton";
import { t } from "i18next";
import { ConfirmationModal } from "../../components/confirmationModal/confirmationModal";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store";
import { dynamicApiSlice } from "../../store/dynamicApiSlice";
import { useHistory } from "react-router";

export const CollectionCreateDynamic = () => {
	const meta = directoriesMeta
	const lang = i18n.language
	const dispatch = useAppDispatch()
	const history = useHistory();
	const [newItems, setNewItems] = useState<Map<string, any>>(new Map())
	const [isOpenModal, toggleModal] = useState(false)
	const [backOnClose, setBackOnClose] = useState(false);
	const isChanged = Array.from(newItems.values()).some((value) => !!value);

	const openModal = () => {
		toggleModal(true)
	}

	const closeModal = (navigateBack?: boolean) => {
		toggleModal(false)
		if (backOnClose || navigateBack) {
			history.push(`/configuration/${meta.collection}`, { direction: "back" });
		}
	}

	const saveItem = async () => { 
		await dispatch(
      dynamicApiSlice.endpoints.addCollectionItem.initiate({
				meta: directoriesMeta,
				items: newItems
      }),
    )
		closeModal(true);
	}

	const onChangeValues = (key: string, value: any) => {
		const items = new Map(newItems)
		items.set(key, value)
		setNewItems(items)
	}

	const navigateBack = () => {
		if (!isChanged) {
			history.push(`/configuration/${meta.collection}`, { direction: "back" });
			return;
		} 
		setBackOnClose(true);
		openModal();
	}

	useEffect(() => {
		const items = new Map()
		meta.fields.forEach(field => {
			if (field.required) {
				items.set(field.field, null)
			}
		})
	}, [])

	return (
		<IonPage>
			<Header
				title={t("operations.directories.add")}
				onBackClick={navigateBack}
				backButtonHref={`/configuration/${meta.collection}`}
			/>
			<IonContent>
				{meta.fields.map(field => {
					const fieldName = field.translations && field.translations[lang] || field.field

					if (field.required) {
						return (
							<Input key={field.field} label={fieldName} value={newItems.get(field.field)} required={field.required} handleChange={(e) => onChangeValues(field.field, e.target.value)} />
						)
					}
				})}

				<BottomButton handleClick={openModal} label={t("operations.save")} disabled={!isChanged} />

			</IonContent>
			<ConfirmationModal
				type="primary"
				isOpen={isOpenModal}
				onClose={closeModal}
				onConfirm={saveItem}
				title={`${t("operations.saveChanges")}?`}
				confirmText={t("operations.save")}
				cancelText={t("operations.cancel")}
			/>
		</IonPage>
	)
}
