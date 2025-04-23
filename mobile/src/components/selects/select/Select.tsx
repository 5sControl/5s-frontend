/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonInput, IonLabel, IonSpinner } from "@ionic/react";
import "./Select.scss";
import { SelectItem } from "../../../models/types/selectItem";
import { useTranslation } from "react-i18next";
import { useMemo, useRef, useState } from "react";

type SelectProps = {
  value: string;
  label?: string;
  placeholder: string;
  selectList: SelectItem[];
  handleChange: (selectedIP: any) => void;
  handleFocus?: () => void;
  isLoading?: boolean;
};

const DynamicSelectInput = ({ label, placeholder, selectList, value, handleChange, handleFocus, isLoading}: SelectProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value || "");
  const [showList, setShowList] = useState(false);
  const inputRef = useRef<HTMLIonInputElement>(null);

  const filteredList = useMemo(
    () =>
      selectList.filter(item =>
        item.value.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [selectList, inputValue]
  );

   const onInput = (e: CustomEvent) => {
    setInputValue(e.detail.value || "");
    setShowList(true);
  };

  const onItemClick = (val: string) => {
    setInputValue(val);
    handleChange(val);
    setShowList(false);
    inputRef.current?.setFocus();
  };

  const onBlur = () => setTimeout(() => setShowList(false), 150);

 
return (
    <div className="autocomplete">
      {label && <IonLabel className="label label__bold">{label}</IonLabel>}
      <IonInput
        ref={inputRef}
        value={inputValue}
        placeholder={placeholder}
        onIonInput={onInput}
        onIonFocus={() => {
          handleFocus && handleFocus();
          setShowList(true);
        }}
        onIonBlur={onBlur}
      />

      {isLoading && <IonSpinner name="dots" />}

      {!isLoading && showList && filteredList.length > 0 && (
        <div className="autocomplete__list">
          {filteredList.map(item => (
            <div
              key={item.value}
              className="autocomplete__item"
              onClick={() => onItemClick(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}

      {!isLoading && showList && filteredList.length === 0 && selectList.length === 0 && (
        <div className="autocomplete__empty">{t("messages.noData")}</div>
      )}
    </div>
  );
};
export default DynamicSelectInput;
