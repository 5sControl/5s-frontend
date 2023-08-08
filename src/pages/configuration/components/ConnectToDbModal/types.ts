import { DatabaseInfo } from '../../types';

export type ConnectionToDatabaseForm = {
  type: string;
  database: string;
  server: string;
  port: string;
  username: string;
  password: string;
};

export type ConnectResponse = {
  message: string;
  success: boolean;
  connection: DatabaseInfo;
};
