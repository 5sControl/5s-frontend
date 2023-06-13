import styles from './tabs.module.scss';
export const Tabs = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ul className={styles.container}>
      <li
        onClick={() => handleTabClick('Camera')}
        className={`${styles.tab} ${
          activeTab === 'Camera' ? styles.tab_active : styles.tab_nonActive
        }`}
      >
        Camera
      </li>
      <li
        onClick={() => handleTabClick('Zones')}
        className={`${styles.tab} ${
          activeTab === 'Zones' ? styles.tab_active : styles.tab_nonActive
        }`}
      >
        Zones
      </li>
      <li
        onClick={() => handleTabClick('Algorithms')}
        className={`${styles.tab} ${
          activeTab === 'Algorithms' ? styles.tab_active : styles.tab_nonActive
        }`}
      >
        Algorithms
      </li>
      <li className={styles.container_underline}></li>
    </ul>
  );
};

// {React.Children.map(children, (child, index) => {
//   if (!child) {
//     return null;
//   }
//   if (!React.isValidElement(child)) {
//     return null;
//   }

//   const { label } = child.props as TabProps;

//   return (
//     <li
//       key={index}
//       onClick={() => handleTabClick(index)}
//       className={`${styles.tab} ${
//         activeTab === index ? styles.tab_active : styles.tab_nonActive
//       }`}
//     >
//       {label}
//     </li>
//   );
// })}

// </ul>
