import { DatabaseInfo } from '../../types';

export type ConnectionToDatabaseForm = {
  database_type: string;
  database: string;
  server: string;
  username: string;
  password: string;
};

export type ConnectResponse = {
  message: string;
  success: boolean;
  connection: DatabaseInfo;
};
