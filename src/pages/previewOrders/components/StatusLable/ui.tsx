import styles from './statusLable.module.scss';

type PropsType = {
  title: string;
  status: 'error' | 'completed' | 'undefined';
  type?: 'text' | 'contained';
  IconLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
  IconRight?: React.FC<React.SVGProps<SVGSVGElement>>;
};

export const StatusLable: React.FC<PropsType> = ({
  type = 'contained',
  status,
  title,
  IconLeft,
  IconRight,
}) => {
  const className = styles[`${type}_${status.toLocaleLowerCase()}`];

  return (
    <div className={className}>
      {IconLeft && <IconLeft className={styles.icon} />}

      <span className={styles.type}>{title}</span>

      {IconRight && <IconRight className={styles.icon} />}
    </div>
  );
};
