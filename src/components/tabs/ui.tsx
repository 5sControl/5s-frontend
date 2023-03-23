import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './tabs.module.scss';
import { TabListProps } from './types';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

type PropsType = {
  children: React.ReactNode;
  tabList: Array<TabListProps>;
  activeTabDefault?: number;
};

export const Tabs: React.FC<PropsType> = ({ children, activeTabDefault = 0, tabList }) => {
  const [activeTab, setActiveTab] = useState(activeTabDefault);
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    navigate(tabList[index].path);
  };

  return (
    <div>
      <ul className={styles.container}>
        {React.Children.map(children, (child, index) => {
          if (!child) {
            return null;
          }
          if (!React.isValidElement(child)) {
            return null;
          }

          const { label } = child.props as TabProps;

          return (
            <li
              onClick={() => handleTabClick(index)}
              className={`${styles.tab} ${activeTab === index ? styles.tab_active : ''}`}
            >
              {label}
            </li>
          );
        })}
      </ul>
      {React.Children.toArray(children)[activeTab]}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};
