import { CompanyInfo } from './companyTab/CompanyInfo';
import { TabListProps } from '../../components/tabs';
import { Contacts } from './contactsTab/Contacts';

export const tabsData: TabListProps[] = [
  {
    id: 0,
    title: 'My company',
    path: '/company',
    component: <CompanyInfo />,
  },
  {
    id: 1,
    title: 'Contacts',
    path: '/company/contacts',
    component: <Contacts />,
  },
];
