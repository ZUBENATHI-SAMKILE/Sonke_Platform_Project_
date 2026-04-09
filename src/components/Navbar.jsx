import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { initials, getAvatarColor } from '../utils/helpers';
import styles from '../styles/App.module.css';

export default function Navbar({ setPage, onOpenAddProject }) {
  const { currentUser, logoutUser } = useContext(AppContext);
  const [activePage, setActivePage] = useState('feed');

  const handlePageChange = (page) => {
    setActivePage(page);
    setPage(page);
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLogo}>
        <div className={styles.topbarLogoIcon}>M</div>
        Mzansi<span>Builds</span>
      </div>

      <div className={styles.topbarNav}>
        <button
          className={`${styles.navBtn} ${activePage === 'feed' ? styles.active : ''}`}
          onClick={() => handlePageChange('feed')}
        >
          Live Feed
        </button>
        <button
          className={`${styles.navBtn} ${activePage === 'profile' ? styles.active : ''}`}
          onClick={() => handlePageChange('profile')}
        >
          My Profile
        </button>
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.btnSecondary} onClick={onOpenAddProject} style={{ fontSize: '13px', padding: '7px 14px' }}>
          + New Project
        </button>
        <div
          className={styles.userAvatar}
          style={{ background: getAvatarColor(currentUser?.name || '') }}
          onClick={() => handlePageChange('profile')}
          title="Go to Profile"
        >
          {initials(currentUser?.name || '')}
        </div>
        <button 
          className={styles.btnSecondary} 
          onClick={logoutUser}
          style={{ fontSize: '13px', padding: '7px 14px', marginLeft: '8px' }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
}