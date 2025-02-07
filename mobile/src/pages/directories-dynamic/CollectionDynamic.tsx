import { IonContent, IonItem, IonList, IonPage } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { Preloader } from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useGetCollectionQuery } from "../../store/dynamicApiSlice";
import { directoriesMeta } from "./Meta";
import Fab from "../../components/fab/Fab";
import { Plus } from "../../assets/svg/SVGcomponent";
import { useHistory } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export const CollectionDynamic = () => {
	const meta = directoriesMeta
	const { t } = useTranslation();
	const history = useHistory();
	const { data, isLoading, refetch } = useGetCollectionQuery(meta)
	const [searchText, setSearchText] = useState("");

	const onPressItem = (id: any) => {
		history.push(meta.collection + '/' + id);
	}

	const onPressAddItem = () => {
		history.push(meta.collection + '/' + "create/new");
	}

	const onSearchChange = (value: string) => setSearchText(value);

	useEffect(() => {
		const unlisten = history.listen(() => {
		refetch();
		});

		return () => {
		unlisten();
		};
	}, [history, refetch]);

	const filteredData = useMemo(() => data?.filter(item => item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())), [data, searchText]);
	
	return (
		<IonPage>
			<Header
				title={t("menu.generalDirectories")}
				backButtonHref={'/configuration'}
				searchBar={!!data?.length}
				searchPlaceholder={t("operations.directories.search")}
				searchText={searchText}
				onSearchChange={onSearchChange}
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
								{filteredData.map(item => (
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
