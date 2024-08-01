export const inputProps = [
  {
    id: 'server',
    name: 'server',
    label: 'Host',
    type: 'text',
    placeholder: 'Enter host',
    required: true,
    defaultValue: '',
  },
  {
    id: 'port',
    name: 'port',
    label: 'Port',
    type: 'text',
    placeholder: 'Enter port',
    required: true,
    defaultValue: '',
  },
  {
    id: 'database',
    name: 'database',
    label: 'Database name',
    type: 'text',
    placeholder: 'Database name',
    required: true,
    defaultValue: '',
  },
  {
    id: 'username',
    name: 'username',
    label: 'User',
    type: 'text',
    placeholder: 'Enter user',
    required: true,
    defaultValue: '',
  },
  {
    id: 'password',
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    showEye: true,
    required: true,
    defaultValue: '',
  },
];

export const odooInputProps = [
  {
    id: 'erp_system',
    name: 'erp_system',
    type: 'hidden',
    defaultValue: 'odoo',
  },
  {
    id: 'type',
    name: 'type',
    type: 'hidden',
    defaultValue: 'api',
  },
  {
    id: 'dmbs',
    name: 'dmbs',
    type: 'hidden',
    defaultValue: 'postgres',
  },
  {
    id: 'host',
    name: 'host',
    label: 'Host',
    type: 'text',
    placeholder: 'Enter host',
    required: true,
    defaultValue: '',
  },
  {
    id: 'username',
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    required: true,
    defaultValue: '',
  },
  {
    id: 'password',
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    showEye: true,
    required: true,
    defaultValue: '',
  },
];

export const manifestIputProps = [];

export const FormTypes = {
  winkhaus: inputProps,
  odoo: odooInputProps,
  manifest: manifestIputProps,
};

export const listOfDataForSelect = [{ id: 0, text: 'WBNet' }];
