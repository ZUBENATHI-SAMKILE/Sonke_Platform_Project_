import { useContext, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import { getAvatarColor, initials } from '../utils/helpers';
import styles from '../styles/App.module.css';

export default function Feed({ onOpenAddProject, onOpenMilestone, onNavigateToProfile }) {
  const { currentUser, projects, users } = useContext(AppContext);
  const [celebrationBanner, setCelebrationBanner] = useState('');

  const myProjects = projects.filter(p => p.userId === currentUser?.id);
  const completed = projects.filter(p => p.completed);

  useEffect(() => {
    if (celebrationBanner) {
      const timer = setTimeout(() => setCelebrationBanner(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [celebrationBanner]);

  return (
    <div className={styles.mainLayout}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <div className={styles.profileMini}>
            <div className={styles.profileAvatar} style={{ background: getAvatarColor(currentUser?.name || '') }}>
              {initials(currentUser?.name || '')}
            </div>
            <div className={styles.profileName}>{currentUser?.name}</div>
            <div className={styles.profileHandle}>@{currentUser?.handle}</div>
            <div className={styles.profileStats}>
              <div className={styles.pstat}>
                <div className={styles.pstatNum}>{myProjects.length}</div>
                <div className={styles.pstatLabel}>Projects</div>
              </div>
              <div className={styles.pstat}>
                <div className={styles.pstatNum}>{currentUser?.collabs || 0}</div>
                <div className={styles.pstatLabel}>Collabs</div>
              </div>
              <div className={styles.pstat}>
                <div className={styles.pstatNum}>{myProjects.filter(p => p.completed).length}</div>
                <div className={styles.pstatLabel}>Built</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebarCard}>
          <h3>My Stack</h3>
          <div className={styles.stackTags}>
            {(currentUser?.stack || []).map(s => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
          </div>
        </div>

        <div className={styles.sidebarCard}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className={styles.btnPrimary} onClick={onOpenAddProject} style={{ width: '100%', fontSize: '13px', padding: '10px' }}>
              + Start New Project
            </button>
            <button className={styles.btnSecondary} onClick={onNavigateToProfile} style={{ width: '100%', fontSize: '13px', padding: '10px' }}>
              View My Projects
            </button>
          </div>
        </div>
      </div>

      <div className={styles.feed}>
        <div className={styles.feedHeader}>
          <h2>What developers are building 🇿🇦</h2>
        </div>
        {celebrationBanner && (
          <div className={`${styles.celebrationBanner} ${styles.show}`}>
            {celebrationBanner}
          </div>
        )}
        <div>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No projects yet</h3>
              <p>Be the first to build in public!</p>
            </div>
          ) : (
            projects.map(p => {
              const user = users.find(u => u.id === p.userId);
              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  user={user}
                  onUpdateMilestone={onOpenMilestone}
                />
              );
            })
          )}
        </div>
      </div>

      
      <div className={styles.rightSidebar}>
        <div className={styles.sidebarCard + ' ' + styles.celebrationWall}>
          <h3><Sparkles size={16} style={{display: 'inline', marginRight: '6px'}} />Celebration Wall</h3>
          {completed.length === 0 ? (
            <div className={styles.emptyState} style={{ padding: '16px' }}>
              <p>Complete a project to appear here!</p>
            </div>
          ) : (
            <div className={styles.celebGrid}>
              {completed.map(p => {
                const u = users.find(u => u.id === p.userId) || {};
                return (
                  <div key={p.id} className={styles.celebCard}>
                    <div className={styles.celebAvatar} style={{ background: getAvatarColor(u.name || '') }}>
                      {initials(u.name || '')}
                    </div>
                    <div className={styles.celebName}>{u.name || 'Dev'}</div>
                    <div className={styles.celebProject}>{p.title}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.sidebarCard}>
          <h3>Dev Community</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.filter(u => u.id !== currentUser?.id).map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: getAvatarColor(u.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {initials(u.name)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)', fontFamily: 'var(--mono)' }}>@{u.handle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}