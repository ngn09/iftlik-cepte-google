import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import type { User as Profile } from '@/types/user';
import { Skeleton } from '@/components/ui/skeleton';

export interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    fetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore error for no rows found
                console.error("Error fetching profile:", error);
                setProfile(null);
            }
            if (data) {
                setProfile(data);
            }
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile().finally(() => setLoading(false));
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const value = {
        session,
        user,
        profile,
        loading,
        fetchProfile,
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Skeleton className="w-full h-full" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
