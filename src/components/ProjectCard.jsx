import { useState, useContext, useEffect } from 'react';
import { Handshake, Target, MessageCircle, CheckCircle2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { commentService, collaborationService } from '../services/api';
import { initials, getAvatarColor, timeAgo, escHtml } from '../utils/helpers';
import styles from '../styles/Global.css';

export default function ProjectCard({ project, user, onUpdateMilestone, inProfile = false }) {
  const {
    currentUser,
    users,
    comments,
    collaborations,
    addComment,
    setComments,
    setCollaborations,
    updateProfile
  } = useContext(AppContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [collabError, setCollabError] = useState('');

  const isOwn = project.userId === currentUser?.id;
  const projectComments = comments[project.id] || [];
  const collabs = collaborations[project.id] || [];
  const hasCollab = collabs.includes(currentUser?.id);
  const ownerName = project.authorName || user?.name || (project.userId === currentUser?.id ? currentUser?.name : 'Unknown');
  const ownerHandle = project.authorHandle || user?.handle || (project.userId === currentUser?.id ? currentUser?.handle : '');

  useEffect(() => {
    let isMounted = true;
    const loadCollaborators = async () => {
      try {
        const collaboratorIds = await collaborationService.getByProjectId(project.id);
        if (!isMounted) return;
        setCollaborations(prev => ({ ...prev, [project.id]: collaboratorIds }));
      } catch (error) {
        console.error('Unable to load collaborators:', error);
      }
    };

    loadCollaborators();

    return () => {
      isMounted = false;
    };
  }, [project.id, setCollaborations]);

  useEffect(() => {
    if (!showComments || (comments[project.id] && comments[project.id].length > 0)) return;

    let isMounted = true;
    const loadComments = async () => {
      try {
        const loadedComments = await commentService.getByProjectId(project.id);
        if (!isMounted) return;
        setComments(prev => ({ ...prev, [project.id]: loadedComments }));
        setCommentError('');
      } catch (error) {
        console.error('Unable to load comments:', error);
        if (isMounted) {
          setCommentError(error.message || 'Unable to load comments.');
        }
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [showComments, project.id, comments, setComments]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    setCommentError('');

    try {
      const createdComment = await commentService.add(project.id, commentText.trim());
      addComment(project.id, createdComment);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      setCommentError(error.message || 'Unable to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCollab = async () => {
    setCollabError('');

    try {
      const collaboratorIds = await collaborationService.toggle(project.id);
      const updatedCollaborations = { ...collaborations, [project.id]: collaboratorIds };
      setCollaborations(updatedCollaborations);

      if (currentUser) {
        const total = Object.values(updatedCollaborations).filter(ids => ids.includes(currentUser.id)).length;
        updateProfile({ collabs: total });
      }
    } catch (error) {
      console.error('Failed to update collaboration:', error);
      setCollabError(error.message || 'Unable to update collaboration.');
    }
  };

  return (
    <div className={`${styles.projectCard} ${isOwn ? styles.own : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardAvatar} style={{ background: getAvatarColor(user?.name || '') }}>
          {initials(user?.name || '')}
        </div>
        <div className={styles.cardMeta}>
          <div className={styles.cardMetaName}>
            {ownerName || 'Unknown'} <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: '13px', fontFamily: 'var(--mono)' }}>@{ownerHandle || ''}</span>
          </div>
          <div className={styles.cardMetaTime}>{timeAgo(project.ts)}</div>
        </div>
        {isOwn && <span style={{ fontSize: '11px', background: 'var(--black)', color: 'var(--white)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>YOUR PROJECT</span>}
      </div>

      <div className={styles.cardTitle}>{escHtml(project.title)}</div>
      <div className={styles.cardDesc}>{escHtml(project.desc)}</div>

      <div className={styles.cardBadges}>
        <span className={styles.badge + ' ' + styles.badgeStage}>{project.stage}</span>
        {project.support && <span className={styles.badge + ' ' + styles.badgeSupport}>Needs: {project.support}</span>}
        {project.completed && <span className={styles.badge + ' ' + styles.badgeCompleted}><CheckCircle2 size={14} style={{display: 'inline'}} /> Completed</span>}
        {(project.tech || []).map(t => (
          <span key={t} className={styles.badge + ' ' + styles.badgeTech}>{t}</span>
        ))}
      </div>

      <div className={styles.progressBarWrap}>
        <div className={styles.progressLabel}>
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${project.progress || 0}%` }}></div>
        </div>
      </div>

      {(project.milestones || []).length > 0 && (
        <div className={styles.milestones}>
          {project.milestones.map((m, i) => (
            <div key={i} className={styles.milestone + ' ' + styles.done}>
              <div className={styles.check}><CheckCircle2 size={16} style={{display: 'block'}} /></div>
              <span>{m}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.cardActions}>
        {!isOwn && (
          <button
            className={`${styles.actionBtn} ${hasCollab ? styles.active : ''}`}
            onClick={handleToggleCollab}
          >
            <Handshake size={16} color="yellow" /> {hasCollab ? 'Collaborating' : 'Raise Hand'}
          </button>
        )}
        {isOwn && (
          <button
            className={styles.actionBtn}
            onClick={() => onUpdateMilestone(project.id)}
          >
            <Target size={16} /> Update Progress
          </button>
        )}
        <button className={styles.actionBtn} onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={16} /> {projectComments.length} Comment{projectComments.length !== 1 ? 's' : ''}
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}><Handshake size={14} color="yellow" /> {collabs.length}</span>
      </div>

      {collabError && <div className={styles.errorMsg}>{collabError}</div>}
      {commentError && <div className={styles.errorMsg}>{commentError}</div>}

      {showComments && (
        <div className={styles.commentsSection}>
          <div>
            {projectComments.map((c, i) => {
              const commenter = users.find(u => u.id === c.userId) || { name: 'Dev' };
              return (
                <div key={i} className={styles.comment}>
                  <div className={styles.commentAvatar} style={{ background: getAvatarColor(commenter.name) }}>
                    {initials(commenter.name)}
                  </div>
                  <div className={styles.commentBody}>
                    <div className={styles.commentName}>{commenter.name}</div>
                    <div className={styles.commentText}>{escHtml(c.text)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.commentInputRow}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            />
            <button className={styles.commentSubmit} onClick={handlePostComment} disabled={loading}>
              {loading ? '...' : 'Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}