import './Company.scss';
import { Tab, Tabs } from '../../components/tabs';
import { tabsData } from './config';
import { FC } from 'react';

export const Company: FC<{ activeTab: number }> = ({ activeTab }) => {
  return (
    <>
      <div className="company">
        <h2>Company</h2>
        <Tabs activeTabDefault={activeTab} tabList={tabsData}>
          {tabsData.map((tab) => (
            <Tab key={tab.id} label={tab.title}>
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </div>
    </>
  );
};
