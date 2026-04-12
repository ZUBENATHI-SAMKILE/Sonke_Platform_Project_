import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import { getAvatarColor, initials } from '../utils/helpers';
import { EditProfileModal } from '../components/Modals';
import styles from '../styles/Global.css';

export default function Profile({ onOpenMilestone, onSaveProfile }) {
  const { currentUser, projects, users } = useContext(AppContext);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const myProjects = projects.filter(p => p.userId === currentUser?.id);
  const completed = myProjects.filter(p => p.completed);

  const handleSaveProfile = async (updates) => {
    if (onSaveProfile) {
      await onSaveProfile(updates);
    }
    setShowEditProfile(false);
  };

  return (
    <>
      <div className={styles.profilePageActive}>
        <div className={styles.profileHeader}>
          <div className={styles.profileBigAvatar} style={{ background: getAvatarColor(currentUser?.name || '') }}>
            {initials(currentUser?.name || '')}
          </div>
          <div className={styles.profileInfo}>
            <h1>{currentUser?.name}</h1>
            <div className={styles.handle}>@{currentUser?.handle}</div>
            <div className={styles.bio}>{currentUser?.bio || 'No bio yet. Edit your profile to add one.'}</div>
            <div className={styles.profileStatsRow}>
              <div className={styles.psrItem}>
                <div className={styles.psrNum}>{myProjects.length}</div>
                <div className={styles.psrLabel}>Projects</div>
              </div>
              <div className={styles.psrItem}>
                <div className={styles.psrNum}>{currentUser?.collabs || 0}</div>
                <div className={styles.psrLabel}>Collabs</div>
              </div>
              <div className={styles.psrItem}>
                <div className={styles.psrNum}>{completed.length}</div>
                <div className={styles.psrLabel}>Completed</div>
              </div>
            </div>
          </div>
          <button className={styles.btnSecondary + ' ' + styles.editProfileBtn} onClick={() => setShowEditProfile(true)}>
            Edit Profile
          </button>
        </div>

        <div className={styles.sectionTitle}>My Projects</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No projects yet</h3>
              <p>Start building in public!</p>
            </div>
          ) : (
            myProjects
              .sort((a, b) => b.ts - a.ts)
              .map(p => {
                const user = users.find(u => u.id === p.userId);
                return (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    user={user}
                    onUpdateMilestone={onOpenMilestone}
                    inProfile={true}
                  />
                );
              })
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSubmit={handleSaveProfile}
        initialData={{
          name: currentUser?.name || '',
          bio: currentUser?.bio || '',
          stack: (currentUser?.stack || []).join(', ')
        }}
      />
    </>
  );
}
