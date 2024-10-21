import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../shared/constants/routes";
import { useNavigate, useParams } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { useEffect, useState } from "react";
import { getDirectory, updateDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";

const EditDirectoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const [directoryName, setDirectoryName] = useState(id);
  const navigate = useNavigate();

  useEffect(() => {
    getDirectory(Number(id!), cookies.token)
      .then(response => {
        setDirectoryName(response.data.name);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [cookies.token]);

  const handleSave = () => {
    if (directoryName) {
      updateDirectory(Number(id), directoryName, cookies.token).then(() => navigate(ROUTES.DIRECTORIES_ITEM_CARD(id!)));
      return;
    }
    console.error("empty input");
  };

  const { t } = useTranslation();
  return (
    <SingleInputPage
      title={t("directory.editCard")}
      backHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}
      label={t("newConnection.name")}
      value={directoryName!}
      required
      handleChange={e => {
        setDirectoryName(e.target.value);
      }}
      handleSave={handleSave}
    />
  );
};
export default EditDirectoryCard;
