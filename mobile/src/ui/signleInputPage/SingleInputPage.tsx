import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../components/input/Input";
import BottomButton from "../../components/bottomButton/BottomButton";

type SingleInputPageProps = {
  title?: ReactNode;
  backHref?: string;
  label: string;
  value: string;
  required: boolean;
  toastMessage?: string;
  placeholder?: string;
  handleChange: (e: any) => void;
  handleSave: () => void;
};

const SingleInputPage = ({ label, value, required, handleChange, handleSave }: SingleInputPageProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Input label={label} value={value} required={required} handleChange={handleChange}></Input>
      <BottomButton handleClick={handleSave} label={t("operations.save")} disabled={!value.trim()} />
    </>
  );
};
export default SingleInputPage;
