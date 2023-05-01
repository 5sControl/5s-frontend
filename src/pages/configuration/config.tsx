import { Camera } from '../camera/Camera';
import { TabListProps } from '../../components/tabs';
import { DatabaseTab } from './components/DatabaseTab/DatabaseTab';
import { Notifications } from '../Notifications/notifications';

export const tabsData: TabListProps[] = [
  {
    id: 0,
    title: 'Camera',
    path: '/configuration/camera',
    component: <Camera />,
  },
  {
    id: 1,
    title: 'Database',
    path: '/configuration/database',
    component: <DatabaseTab />,
  },
  {
    id: 2,
    title: 'Notifications',
    path: '/configuration/notifications',
    component: <Notifications />,
  },
];
