import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../../components/preloader";

const NewDirectory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (directoryName) {
      setLoading(true);
      createDirectory(directoryName, false, cookies.token)
        .then(() => navigate(ROUTES.GENEREAL_DIRECTORIES))
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    console.error("empty input");
  };

  return loading ? (
    <div className="preloader">
      <Preloader />
    </div>
  ) : (
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
