const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const parseResponse = async (response) => {
  const contentType = response.headers.get('Content-Type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (response.ok) {
    return body;
  }

  const message = body?.message || body?.error || body || response.statusText || 'Request failed';
  throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : { 'Content-Type': 'application/json' };
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return parseResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return parseResponse(response);
  }
};

export const projectService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/projects`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  },

  create: async (projectData) => {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return parseResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return parseResponse(response);
  },

  getUserProjects: async (userId) => {
    const response = await fetch(`${API_BASE}/projects/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  }
};

export const userService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return parseResponse(response);
  }
};

export const commentService = {
  add: async (projectId, text) => {
    const response = await fetch(`${API_BASE}/projects/${projectId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text })
    });
    return parseResponse(response);
  },

  getByProjectId: async (projectId) => {
    const response = await fetch(`${API_BASE}/projects/${projectId}/comments`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  }
};

export const collaborationService = {
  toggle: async (projectId) => {
    const response = await fetch(`${API_BASE}/projects/${projectId}/collaborators/toggle`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  },

  getByProjectId: async (projectId) => {
    const response = await fetch(`${API_BASE}/projects/${projectId}/collaborators`, {
      headers: getAuthHeaders()
    });
    return parseResponse(response);
  }
};
