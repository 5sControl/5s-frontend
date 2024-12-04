import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { Preloader } from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useGetCollectionQuery } from "../../store/dynamicApiSlice";
import { directoriesMeta } from "./Meta";
import Fab from "../../components/fab/Fab";
import { Plus } from "../../assets/svg/SVGcomponent";
import { useHistory } from "react-router-dom";
import i18n from "../../i18";
import { useEffect } from "react";

export const CollectionDynamic = () => {
	const meta = directoriesMeta
	const { t } = useTranslation();
	const history = useHistory();
	const { data, isLoading, refetch } = useGetCollectionQuery(meta)
	const lang = i18n.language

	const onPressItem = (id: any) => {
		history.push(meta.collection + '/' + id);
	}

	const onPressAddItem = () => {
		history.push(meta.collection + '/' + "create/new");
	}

	const title = meta.translations && meta.translations[lang] || meta.label

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
			<Header
				title={title}
				backButtonHref={'/configuration'}
			/>
			<IonContent>
				<Fab icon={Plus} handleFabClick={() => onPressAddItem()} />
				{isLoading ?
					<div className="preloader">
						<Preloader />
					</div>
					:
					<IonList inset>
						{!data || data.length === 0 ?
							<IonItem>{t("messages.noDatabases")}</IonItem>
							:
							<>
								{data.map(item => (
									<MenuListButton
										key={item[meta.displayField]}
										title={item[meta.displayField]}
										handleItemClick={() => {
											onPressItem(item["id"])
										}}
									/>
								))}
							</>
						}
					</IonList>
				}
			</IonContent>
		</IonPage>
	)
}
