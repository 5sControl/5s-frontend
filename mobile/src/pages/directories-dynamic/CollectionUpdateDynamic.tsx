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
import { dynamicApiSlice, useGetCollectionItemQuery } from "../../store/dynamicApiSlice";
import { useHistory, useLocation, useParams } from "react-router";

export const CollectionUpdateDynamic = () => {
	const meta = directoriesMeta
	const lang = i18n.language
	const title = meta.translations && meta.translations[lang] || meta.label
	const { id } = useParams<{ id: any }>();
	const { data } = useGetCollectionItemQuery({ meta, itemId: id })
	const history = useHistory();
	const dispatch = useAppDispatch()
	const [newItems, setNewItems] = useState<Map<string, any>>(new Map())
	const [isOpenModal, toggleModal] = useState(false)

	const onPressSaveButton = () => {
		toggleModal(true)
	}

	const onPressCloseModal = () => {
		toggleModal(false)
	}

	const saveItem = async () => {
		await dispatch(
			dynamicApiSlice.endpoints.updateCollectionItem.initiate({
				meta: directoriesMeta,
				itemId: Number(id),
				updates: newItems
			}),
		)
		toggleModal(false)
		history.go(-1)
	}


	const onChangeValues = (key: string, value: any) => {
		let items = new Map(newItems)
		items.set(key, value)
		setNewItems(items)
	}

	useEffect(() => {
		if (data) {
			let items = new Map()
			meta.fields.forEach(field => {
				if (field.required) {
					items.set(field.field, data[field.field])
				}
			})
			setNewItems(items)
		}
	}, [data])

	return (
		<IonPage>
			<Header
				title={title}
				backButtonHref={`/configuration/${meta.collection}`}
			/>
			<IonContent>

				{meta.fields.map(field => {
					let fieldName = field.translations && field.translations[lang] || field.field

					if (field.required) {
						return (
							<Input key={field.field} label={fieldName} value={newItems.get(field.field)} required={field.required} handleChange={(e) => onChangeValues(field.field, e.target.value)} />
						)
					}
				})}

				<BottomButton handleClick={onPressSaveButton} label={t("operations.save")} disabled={false} />

			</IonContent>
			<ConfirmationModal
				type="primary"
				isOpen={isOpenModal}
				onClose={onPressCloseModal}
				onConfirm={saveItem}
				title={`${t("operations.saveChanges")}?`}
				confirmText={t("operations.save")}
				cancelText={t("operations.cancel")}
			/>
		</IonPage>
	)
}