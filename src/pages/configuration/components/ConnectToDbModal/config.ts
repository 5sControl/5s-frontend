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
    id: '0',
    name: 'type',
    label: 'Host',
    type: 'text',
    placeholder: 'Enter host',
    required: true,
    defaultValue: '',
  },
];

export const FormTypes = {
  winkhaus: inputProps,
  odoo: odooInputProps,
};

export const listOfDataForSelect = [{ id: 0, text: 'WBNet' }];
