import React, { useState } from 'react';
import styles from './tabs.module.scss';

interface TabProps {
  label: string;
  children: React.ReactNode;
}
export const Tabs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
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
