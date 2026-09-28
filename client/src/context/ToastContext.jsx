import { createContext, useContext, useState } from 'react'; import { CheckCircle2, XCircle } from 'lucide-react';
const ToastContext = createContext(null); let id = 0;
export function ToastProvider({ children }) { const [items, setItems] = useState([]); const show = (message, type = 'success') => { const key = ++id; setItems(x => [...x, { key, message, type }]); setTimeout(() => setItems(x => x.filter(t => t.key !== key)), 3500); };
 return <ToastContext.Provider value={show}>{children}<div className="toasts">{items.map(t => <div className={`toast ${t.type}`} key={t.key}>{t.type === 'error' ? <XCircle size={18}/> : <CheckCircle2 size={18}/>}<span>{t.message}</span></div>)}</div></ToastContext.Provider>; }
export const useToast = () => useContext(ToastContext);

