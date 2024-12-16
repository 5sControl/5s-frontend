import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from './styles.module.scss';
import { getTaskManager } from '../../../../api/notificationRequest';
import { LogsModal } from './logsModal';

export const ProcessesComponent = () => {
  const [processs, setProcess] = useState<any>([]);
  const [logs, setLogs] = useState<any>(false);

  const useSockets = process.env.REACT_APP_USE_SOCKETS === 'true';

  useEffect(() => {
    if (!useSockets) {
      console.log('Sockets are disabled');
      return;
    }

    const socket = io(process.env.REACT_APP_NGROK, {
      path: '/socket/onvif',
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('tasks', (msg) => {
      const msgArray = Object.entries(msg).map(([key, value]) => ({ key, value }));
      setProcess(msgArray);
    });

    return () => {
      socket.disconnect();
    };
  }, [useSockets]);

  const getLogs = (value: string) => {
    getTaskManager(window.location.hostname, value).then((response) => {
      setLogs(response.data.logs);
      console.log(response);
    });
  };

  return (
    <>
      <table className={styles.fullWidthTable}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.tableColumn1}>Process</th>
            <th className={styles.tableColumn2}>Camera</th>
            <th className={styles.tableColumn3}>Status</th>
            <th className={styles.tableColumn4}>Memory</th>
            <th className={styles.tableColumn5}>CPU, %</th>
            <th className={styles.tableColumn6}>GPU, %</th>
            <th className={styles.tableColumn7}>Logs</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {processs.map((el: any, index: number) => (
            <tr key={index}>
              <td>{el.value.algorithm}</td>
              <td>{el.value.camera_url}</td>
              <td>
                {el.value.status === 'running' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  </svg>
                )}
              </td>
              <td>{el.value.ram}</td>
              <td>{el.value.cpu}</td>
              <td>{el.value?.gpu}</td>
              <td className={styles.tripleDots} onClick={() => getLogs(el.key)}>
                ...
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {logs && <LogsModal logsArray={logs} close={() => setLogs(false)} />}
    </>
  );
};