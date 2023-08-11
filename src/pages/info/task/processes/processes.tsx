import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from './styles.module.scss';
import { getTaskManager } from '../../../../api/notificationRequest';
import { LogsModal } from './logsModal';

export const ProcessesComponent = () => {
  const [process, setProcess] = useState<any>([]);
  const [logs, setLogs] = useState<any>(false);
  useEffect(() => {
    const socket = io(
      `http://${
        window.location.hostname.includes('local') ? '192.168.1.110' : window.location.hostname
      }:3456`
    );
    socket.on('connect', function () {
      console.log('Connected to the server');
    });

    socket.on('tasks', function (msg) {
      const msgArray = Object.entries(msg).map(([key, value]) => ({ key, value }));
      setProcess(msgArray);
    });
  }, []);
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
          {process.map((el: any, index: number) => {
            return (
              <tr key={index}>
                <td>{el.value.algorithm}</td>
                <td>{el.value.camera_url}</td>
                <td>
                  {el.value.status === 'running' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <g id="Group">
                        <g id="Vector">
                          <path
                            d="M12 1.19995C6.03835 1.19995 1.19995 6.03835 1.19995 12C1.19995 17.9615 6.03835 22.7999 12 22.7999C17.9615 22.7999 22.7999 17.9615 22.7999 12C22.7999 6.03835 17.9615 1.19995 12 1.19995ZM9.83995 17.4L4.43995 12L5.96275 10.4772L9.83995 14.3436L18.0371 6.14635L19.5599 7.67995L9.83995 17.4Z"
                            fill="white"
                          />
                          <path
                            d="M9.83995 17.4L4.43995 12L5.96275 10.4772L9.83995 14.3436L18.0371 6.14635L19.5599 7.67995L9.83995 17.4Z"
                            fill="white"
                          />
                        </g>
                        <path
                          id="Vector_2"
                          d="M12 1.19995C6.03835 1.19995 1.19995 6.03835 1.19995 12C1.19995 17.9615 6.03835 22.7999 12 22.7999C17.9615 22.7999 22.7999 17.9615 22.7999 12C22.7999 6.03835 17.9615 1.19995 12 1.19995ZM9.83995 17.4L4.43995 12L5.96275 10.4772L9.83995 14.3436L18.0371 6.14635L19.5599 7.67995L9.83995 17.4Z"
                          fill="#87BC45"
                        />
                      </g>
                    </svg>
                  )}

                  {el.value.status === 'exited' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <g id="Group">
                        <g id="Vector">
                          <path
                            d="M1.90098 22.8494H22.1081C23.521 22.8494 24.4307 21.3591 23.792 20.101L13.6885 2.19715C12.9915 0.80375 10.998 0.80375 10.3012 2.19715L0.197696 20.101C-0.421679 21.3591 0.488028 22.8494 1.90098 22.8494ZM13.5919 18.688C13.5919 19.6171 12.9144 20.3332 11.9467 20.3332C10.9789 20.3332 10.3014 19.6171 10.3014 18.688V18.6493C10.3014 17.7202 10.9789 17.0041 11.9467 17.0041C12.9144 17.0041 13.5919 17.7202 13.5919 18.6493V18.688ZM11.0561 6.59084H12.9531C13.4755 6.59084 13.7854 7.03602 13.7274 7.59732L12.8949 14.875C12.8368 15.3976 12.4884 15.7266 12.0045 15.7266C11.5206 15.7266 11.1722 15.3976 11.1142 14.875L10.2817 7.59732C10.2238 7.03602 10.5337 6.59084 11.0561 6.59084Z"
                            fill="white"
                          />
                          <path
                            d="M11.0561 6.59084H12.9531C13.4755 6.59084 13.7854 7.03602 13.7274 7.59732L12.8949 14.875C12.8368 15.3976 12.4884 15.7266 12.0045 15.7266C11.5206 15.7266 11.1722 15.3976 11.1142 14.875L10.2817 7.59732C10.2238 7.03602 10.5337 6.59084 11.0561 6.59084Z"
                            fill="white"
                          />
                          <path
                            d="M13.5919 18.688C13.5919 19.6171 12.9144 20.3332 11.9467 20.3332C10.9789 20.3332 10.3014 19.6171 10.3014 18.688V18.6493C10.3014 17.7202 10.9789 17.0041 11.9467 17.0041C12.9144 17.0041 13.5919 17.7202 13.5919 18.6493V18.688Z"
                            fill="white"
                          />
                        </g>
                        <path
                          id="Vector_2"
                          d="M1.90098 22.8494H22.1081C23.521 22.8494 24.4307 21.3591 23.792 20.101L13.6885 2.19715C12.9915 0.80375 10.998 0.80375 10.3012 2.19715L0.197696 20.101C-0.421679 21.3591 0.488028 22.8494 1.90098 22.8494ZM13.5919 18.688C13.5919 19.6171 12.9144 20.3332 11.9467 20.3332C10.9789 20.3332 10.3014 19.6171 10.3014 18.688V18.6493C10.3014 17.7202 10.9789 17.0041 11.9467 17.0041C12.9144 17.0041 13.5919 17.7202 13.5919 18.6493V18.688ZM11.0561 6.59084H12.9531C13.4755 6.59084 13.7854 7.03602 13.7274 7.59732L12.8949 14.875C12.8368 15.3976 12.4884 15.7266 12.0045 15.7266C11.5206 15.7266 11.1722 15.3976 11.1142 14.875L10.2817 7.59732C10.2238 7.03602 10.5337 6.59084 11.0561 6.59084Z"
                          fill="#E00606"
                        />
                      </g>
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
            );
          })}
        </tbody>
      </table>
      {logs && <LogsModal logsArray={logs} close={() => setLogs(false)} />}
    </>
  );
};
