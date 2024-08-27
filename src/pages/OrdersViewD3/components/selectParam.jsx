import React, { useState, useRef, useEffect } from 'react';
import styles from './selectParam.module.scss';
import { ArrowTop, ArrowDown } from '../../../assets/svg/SVGcomponent';
import { Button } from '../../../components/button';

export const SelectParam = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <Button
        text={`Zoom: ${selectedValue}`}
        variant="oval"
        onClick={handleToggleOpen}
        iconColor="var(--LowEmphasis)"
        IconRight={isOpen ? ArrowTop : ArrowDown}
        stylesClassName="fullWidth"
      />
      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`${styles.dropdownItem} ${
                option === selectedValue ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
