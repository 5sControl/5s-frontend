/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonInput, IonLabel, IonSpinner } from "@ionic/react";
import "./Select.scss";
import { SelectItem } from "../../../models/types/selectItem";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

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
  const {t} = useTranslation();
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredList, setFilteredList] = useState(selectList);
  const [showList, setShowList] = useState(false);

  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    setFilteredList(
      selectList.filter(item => item.value.toLowerCase().includes(inputValue.toLowerCase()))
    );
  }, [inputValue, selectList]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInput = (e: CustomEvent) => {
    const val = e.detail.value || '';
    setInputValue(val);
    handleChange(val);
    setShowList(true);
  };

  const handleItemClick = (selectedValue: string) => {
    setInputValue(selectedValue);
    handleChange(selectedValue);
    setShowList(false);
    inputRef.current?.setFocus();
  };

  const handleBlur = () => {
    setTimeout(() => setShowList(false), 200);
  };

 
return (
    <div className="autocomplete">
      {label && <IonLabel className="label label__bold">{label}</IonLabel>}
      <IonInput
        ref={inputRef}
        value={inputValue}
        placeholder={placeholder}
        onIonInput={handleInput}
        onIonFocus={() => {
          handleFocus && handleFocus();
          setShowList(true);
        }}
        onIonBlur={handleBlur}
      />

      {isLoading && <IonSpinner name="dots" />}

      {!isLoading && showList && filteredList.length > 0 && (
        <div className="autocomplete__list">
          {filteredList.map(item => (
            <div
              key={item.value}
              className="autocomplete__item"
              onClick={() => handleItemClick(item.value)}
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
