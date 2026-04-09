import { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import { AddProjectModal, MilestoneModal } from './components/Modals';
import { projectService, userService } from './services/api';
import styles from './styles/App.module.css';

function AppContent() {
  const { currentUser, projects, updateProject, addProject, updateProfile, setProjects, setUsers, setComments, setCollaborations } = useContext(AppContext);
  const [page, setPage] = useState('feed');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [apiError, setApiError] = useState('');
  const currentProject = projects.find(p => p.id === currentProjectId);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;

      setApiError('');
      let projectsData = [];
      try {
        console.log('Fetching all data for user:', currentUser.id);

        projectsData = await projectService.getAll();
        console.log('Projects loaded:', projectsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setApiError(error.message || 'Unable to load projects.');
      }

      try {
        const usersData = await userService.getAll();
        console.log('Users loaded:', usersData);
        setUsers(usersData);
        if (!usersData.some(u => u.id === currentUser.id)) {
          setUsers(prev => [currentUser, ...prev]);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers(prev => prev.some(u => u.id === currentUser.id) ? prev : [currentUser, ...prev]);
        setApiError(prev => prev ? prev : (error.message || 'Unable to load users.'));
      }

      setComments(prev => {
        const next = { ...prev };
        projectsData.forEach(project => {
          if (next[project.id] === undefined) next[project.id] = [];
        });
        return next;
      });

      setCollaborations(prev => {
        const next = { ...prev };
        projectsData.forEach(project => {
          if (next[project.id] === undefined) next[project.id] = [];
        });
        return next;
      });
    };

    loadData();
  }, [currentUser, setProjects, setUsers, setComments, setCollaborations]);

  const handleAddProject = async (projectData) => {
    try {
      setApiError('');
      const newProject = await projectService.create({
        ...projectData,
        userId: currentUser.id
      });
      addProject(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
      setApiError(error.message || 'Unable to create project.');
    }
  };

  const handleUpdateMilestone = async (projectId, milestoneData) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const stageProgress = {
        Idea: 5,
        Planning: 15,
        'In Progress': 40,
        Alpha: 55,
        Beta: 70,
        MVP: 85,
        Completed: 100
      };

      const updates = {
        stage: milestoneData.stage,
        ts: Date.now(),
        progress: stageProgress[milestoneData.stage] || project.progress,
        completed: milestoneData.stage === 'Completed'
      };

      if (milestoneData.text) {
        updates.milestones = [...(project.milestones || []), milestoneData.text];
      }

      await projectService.update(projectId, updates);
      updateProject(projectId, updates);
    } catch (error) {
      console.error('Failed to update project:', error);
      setApiError(error.message || 'Unable to update project progress.');
    }
  };

  const handleSaveProfile = async (updates) => {
    try {
      await userService.update(currentUser.id, updates);
      updateProfile(updates);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setApiError(error.message || 'Unable to update profile.');
    }
  };

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <>
      <Navbar setPage={setPage} onOpenAddProject={() => setShowAddProject(true)} />
      {apiError && <div className={styles.errorMsg} style={{ margin: '12px auto', maxWidth: '920px' }}>{apiError}</div>}
      {page === 'feed' && (
        <Feed
          onOpenAddProject={() => setShowAddProject(true)}
          onOpenMilestone={(projectId) => {
            setCurrentProjectId(projectId);
            setShowMilestone(true);
          }}
          onNavigateToProfile={() => setPage('profile')}
        />
      )}

      {page === 'profile' && (
        <Profile
          onOpenMilestone={(projectId) => {
            setCurrentProjectId(projectId);
            setShowMilestone(true);
          }}
          onSaveProfile={handleSaveProfile}
        />
      )}

      <AddProjectModal
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        onSubmit={handleAddProject}
      />

      <MilestoneModal
        isOpen={showMilestone}
        onClose={() => {
          setShowMilestone(false);
          setCurrentProjectId(null);
        }}
        onSubmit={(data) => handleUpdateMilestone(currentProjectId, data)}
        project={currentProject}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;