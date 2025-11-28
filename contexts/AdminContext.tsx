import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminContextType {
    isAdmin: boolean;
    session: any;
    setSession: (session: any) => void;
}

const AdminContext = createContext<AdminContextType>({
    isAdmin: false,
    session: null,
    setSession: () => { },
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsAdmin(!!session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsAdmin(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, session, setSession }}>
            {children}
        </AdminContext.Provider>
    );
};
