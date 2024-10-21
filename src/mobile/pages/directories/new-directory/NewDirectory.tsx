import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";

const NewDirectory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");

  const handleSave = () => {
    if (directoryName) {
      console.log(directoryName);
      createDirectory(directoryName, false, cookies.token).then(() => navigate(ROUTES.GENEREAL_DIRECTORIES));
      return;
    }
    console.error("empty input");
  };

  return (
    <SingleInputPage
      title={t("directory.newDirectory")}
      backHref={ROUTES.GENEREAL_DIRECTORIES}
      label={t("newConnection.name")}
      value={directoryName}
      required
      handleChange={e => {
        setDirectoryName(e.target.value);
      }}
      handleSave={handleSave}
    />
  );
};
export default NewDirectory;
