import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState({});
  const [collaborations, setCollaborations] = useState({});

  const persistCurrentUser = (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const loginUser = useCallback((user) => {
    setCurrentUser(user);
    persistCurrentUser(user);
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const registerUser = useCallback((newUser) => {
    setCurrentUser(newUser);
    persistCurrentUser(newUser);
  }, []);

  const addProject = useCallback((project) => {
    setProjects(prev => [project, ...prev]);
    setComments(prev => ({ ...prev, [project.id]: [] }));
    setCollaborations(prev => ({ ...prev, [project.id]: [] }));
  }, []);

  const updateProject = useCallback((projectId, updates) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  }, []);

  const addComment = useCallback((projectId, comment) => {
    setComments(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), comment]
    }));
  }, []);

  const toggleCollaboration = useCallback((projectId) => {
    const userId = currentUser?.id;
    if (!userId) return;

    setCollaborations(prev => {
      const collab = prev[projectId] || [];
      const idx = collab.indexOf(userId);
      let newCollabs = { ...prev };
      
      if (idx === -1) {
        newCollabs = { ...prev, [projectId]: [...collab, userId] };
      } else {
        newCollabs = { ...prev, [projectId]: collab.filter((_, i) => i !== idx) };
      }
      
      const totalCollabProjects = Object.values(newCollabs).filter(collaborators => collaborators.includes(userId)).length;
      setCurrentUser(u => {
        const nextUser = { ...u, collabs: totalCollabProjects };
        persistCurrentUser(nextUser);
        return nextUser;
      });
      
      return newCollabs;
    });
  }, [currentUser?.id]);

  const updateProfile = useCallback((updates) => {
    setCurrentUser(prev => {
      const nextUser = { ...prev, ...updates };
      persistCurrentUser(nextUser);
      return nextUser;
    });
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
  }, [currentUser?.id]);

  const value = {
    currentUser,
    users,
    projects,
    comments,
    collaborations,
    loginUser,
    logoutUser,
    registerUser,
    addProject,
    updateProject,
    addComment,
    toggleCollaboration,
    updateProfile,
    setUsers,
    setProjects,
    setComments,
    setCollaborations
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
