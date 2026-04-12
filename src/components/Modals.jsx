import { useState } from 'react';
import styles from '../styles/Global.css';
import { Sparkles } from 'lucide-react';

export function AddProjectModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    stage: 'In Progress',
    support: '',
    tech: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.desc) {
      alert('Please add a project name and description.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        title: formData.name,
        desc: formData.desc,
        stage: formData.stage,
        support: formData.support,
        tech: formData.tech.split(',').map(s => s.trim()).filter(Boolean)
      });
      setFormData({ name: '', desc: '', stage: 'In Progress', support: '', tech: '' });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2>Start Building in Public</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="What are you building?"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe your project — what problem does it solve?"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              <option value="Idea">Idea</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
              <option value="MVP">MVP</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Support Needed</label>
            <select
              value={formData.support}
              onChange={(e) => setFormData({ ...formData, support: e.target.value })}
            >
              <option value="">None right now</option>
              <option value="Co-founder">Co-founder</option>
              <option value="Design help">Design help</option>
              <option value="Backend dev">Backend dev</option>
              <option value="Frontend dev">Frontend dev</option>
              <option value="QA / Testing">QA / Testing</option>
              <option value="Mentorship">Mentorship</option>
              <option value="Funding">Funding</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Tech Stack</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, PostgreSQL"
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish to Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MilestoneModal({ isOpen, onClose, onSubmit, project }) {
  const [formData, setFormData] = useState({
    text: '',
    stage: project?.stage || 'In Progress'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        text: formData.text,
        stage: formData.stage
      });
      setFormData({ text: '', stage: project?.stage || 'In Progress' });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: '460px' }}>
        <h2>Update Progress</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>New Milestone Achieved</label>
            <input
              type="text"
              placeholder="e.g. Deployed to production, Added auth..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Update Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              <option value="Idea">Idea</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
              <option value="MVP">MVP</option>
              <option value="Completed">Completed <Sparkles size={16} color="yellow"/> </option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditProfileModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || { name: '', bio: '', stack: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Name cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        name: formData.name,
        bio: formData.bio,
        stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean)
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={formData.stack}
              onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
