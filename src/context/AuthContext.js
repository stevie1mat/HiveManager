import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Check initial session first
    const initializeAuth = async () => {
      // First, check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (mounted) {
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
        } else if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            emailConfirmed: !!session.user.email_confirmed_at || !!session.user.confirmed_at,
            firstName: session.user.user_metadata?.firstName,
            lastName: session.user.user_metadata?.lastName,
            displayName: session.user.user_metadata?.displayName || 
              `${session.user.user_metadata?.firstName || ''} ${session.user.user_metadata?.lastName || ''}`.trim(),
          });
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    // Then set up listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          emailConfirmed: !!session.user.email_confirmed_at || !!session.user.confirmed_at,
          firstName: session.user.user_metadata?.firstName,
          lastName: session.user.user_metadata?.lastName,
          displayName: session.user.user_metadata?.displayName || 
            `${session.user.user_metadata?.firstName || ''} ${session.user.user_metadata?.lastName || ''}`.trim(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          emailConfirmed: !!session.user.email_confirmed_at || !!session.user.confirmed_at,
          firstName: session.user.user_metadata?.firstName,
          lastName: session.user.user_metadata?.lastName,
          displayName: session.user.user_metadata?.displayName || 
            `${session.user.user_metadata?.firstName || ''} ${session.user.user_metadata?.lastName || ''}`.trim(),
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user || data?.session) {
        // Get the latest session to ensure we have the most up-to-date user data
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const user = session.user;
          // Check if email is confirmed
          // email_confirmed_at is the primary field, confirmed_at is an alias
          // If both are null/undefined, email is not confirmed
          const emailConfirmed = !!(user.email_confirmed_at || user.confirmed_at);
          
          setUser({
            id: user.id,
            email: user.email,
            emailConfirmed: emailConfirmed,
            firstName: user.user_metadata?.firstName,
            lastName: user.user_metadata?.lastName,
            displayName: user.user_metadata?.displayName || 
              `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim(),
          });
        } else if (data?.user) {
          // Fallback to data.user if session is not available
          const user = data.user;
          const emailConfirmed = !!(user.email_confirmed_at || user.confirmed_at);
          
          setUser({
            id: user.id,
            email: user.email,
            emailConfirmed: emailConfirmed,
            firstName: user.user_metadata?.firstName,
            lastName: user.user_metadata?.lastName,
            displayName: user.user_metadata?.displayName || 
              `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim(),
          });
        }
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An error occurred during login' };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
          firstName: data.user.user_metadata?.firstName,
          lastName: data.user.user_metadata?.lastName,
          displayName: data.user.user_metadata?.displayName || `${firstName} ${lastName}`,
        });
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'An error occurred during registration' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resendConfirmationEmail = async () => {
    try {
      if (!user?.email) {
        return { success: false, error: 'No email address found' };
      }
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      return { success: false, error: error.message || 'Failed to resend confirmation email' };
    }
  };

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resendConfirmationEmail,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
