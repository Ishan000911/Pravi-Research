import { createContext, useContext, useEffect, useMemo, useState } from 'react'; import api from '../api/client';
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { const token = localStorage.getItem('token'); if (!token) return setLoading(false); api.get('/auth/me').then(r => setUser(r.data.user)).finally(() => setLoading(false)); }, []);
  const login = async data => { const r = await api.post('/auth/login', data); localStorage.setItem('token', r.data.token); setUser(r.data.user); };
  const register = async data => { const r = await api.post('/auth/register', data); localStorage.setItem('token', r.data.token); setUser(r.data.user); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const value = useMemo(() => ({ user, loading, login, register, logout, canEdit: ['Admin', 'Asset Manager'].includes(user?.role), isAdmin: user?.role === 'Admin' }), [user, loading]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; }
export const useAuth = () => useContext(AuthContext);

