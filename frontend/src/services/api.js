const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getHeaders = (id) => ({
    'Content-Type': 'application/json',
    'x-user-id': id || localStorage.getItem('taskAppUser') ? JSON.parse(localStorage.getItem('taskAppUser')).id : ''
});

export const register = async (username, password) => {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
    }
    return res.json();
};

export const login = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
    }
    return res.json();
};

export const fetchUserStats = async (userId) => {
    const res = await fetch(`${API_URL}/users/me`, {
        headers: getHeaders(userId)
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
};

export const getTasks = async (userId) => {
    const res = await fetch(`${API_URL}/tasks`, {
        headers: getHeaders(userId)
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized');
        throw new Error('Failed to fetch tasks');
    }
    return res.json();
};

export const createTask = async (task, userId) => {
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
};

export const updateTask = async (id, task, userId) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(userId),
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
};

export const deleteTask = async (id, userId) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return true;
};
