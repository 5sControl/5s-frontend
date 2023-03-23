import { Camera } from '../../components/camera/Camera';
import { TabListProps } from '../../components/tabs';
import { DatabaseTab } from './components/DatabaseTab';
import { LicenseTab } from './components/LicenseTab';

export const tabsData: TabListProps[] = [
  {
    id: 0,
    title: 'License',
    path: '/configuration/license',
    component: <LicenseTab />,
  },
  {
    id: 1,
    title: 'Database',
    path: '/configuration/database',
    component: <DatabaseTab />,
  },

  {
    id: 2,
    title: 'Camera',
    path: '/configuration/camera',
    component: <Camera />,
  },
];
