const API_BASE_URL = 'http://localhost:3001/api';

// Utility function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

// Types
export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null;
          content: string;
          created_at: string;
          excerpt: string | null;
          id: string;
          image_url: string | null;
          meta_description: string | null;
          meta_title: string | null;
          published_at: string | null;
          slug: string;
          status: 'draft' | 'published' | 'archived';
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      portfolio_projects: {
        Row: {
          category: 'classic' | 'ai' | 'ecommerce';
          created_at: string;
          created_by: string | null;
          description: string;
          featured: boolean | null;
          github_url: string | null;
          id: string;
          image_url: string | null;
          is_published: boolean | null;
          live_url: string | null;
          sort_order: number | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['portfolio_projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['portfolio_projects']['Insert']>;
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          password_hash: string;
          role: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      site_settings: {
        Row: {
          about_description: string | null;
          about_title: string;
          ai_integrations: number | null;
          contact_email: string | null;
          contact_phone: string | null;
          hero_description: string | null;
          hero_subtitle: string;
          hero_title: string;
          id: string;
          projects_count: number | null;
          satisfaction_rate: number | null;
          social_github: string | null;
          social_linkedin: string | null;
          social_telegram: string | null;
          updated_at: string;
          updated_by: string | null;
          years_experience: number | null;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
    };
  };
};

// Auth API
export const auth = {
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    try {
      const result = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('auth_token', result.token);
      return { data: { session: { user: result.user } }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  signOut: async () => {
    localStorage.removeItem('auth_token');
    return { error: null };
  },
  getSession: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { data: { session: null }, error: null };
    }
    try {
      // Decode token to get user info (simple implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { data: { session: { user: { id: payload.id, email: payload.email } } }, error: null };
    } catch {
      localStorage.removeItem('auth_token');
      return { data: { session: null }, error: null };
    }
  },
  getUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { data: { user: null }, error: null };
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { data: { user: { id: payload.id, email: payload.email } }, error: null };
    } catch {
      return { data: { user: null }, error: null };
    }
  },
  updateUser: async ({ password }: { password: string }) => {
    try {
      await apiCall('/auth/update-password', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      return { data: { user: null }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // Simple implementation - check token existence
    const checkSession = () => {
      const token = localStorage.getItem('auth_token');
      let session = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          session = { user: { id: payload.id, email: payload.email } };
        } catch {}
      }
      callback('SIGNED_IN', session);
    };
    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  },
};

// Database API
export const db = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          try {
            const endpoint = table === 'profiles' ? `/profiles` :
                           table === 'site_settings' ? `/site-settings` :
                           table === 'portfolio_projects' ? `/portfolio-projects` :
                           table === 'blog_posts' ? `/blog-posts` : `/${table}`;
            const result = await apiCall(endpoint);
            const item = result.data.find((item: any) => item[column] === value);
            return { data: item || null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        order: (orderBy: string, opts?: { ascending?: boolean }) => async () => {
          try {
            const endpoint = table === 'profiles' ? `/profiles` :
                           table === 'site_settings' ? `/site-settings` :
                           table === 'portfolio_projects' ? `/portfolio-projects` :
                           table === 'blog_posts' ? `/blog-posts` : `/${table}`;
            const result = await apiCall(endpoint);
            let data = result.data;
            data.sort((a: any, b: any) => {
              const aVal = a[orderBy];
              const bVal = b[orderBy];
              if (opts?.ascending === false) {
                return bVal > aVal ? 1 : -1;
              }
              return aVal > bVal ? 1 : -1;
            });
            return { data, error: null };
          } catch (error) {
            return { data: [], error };
          }
        }
      }),
      order: (orderBy: string, opts?: { ascending?: boolean }) => async () => {
        try {
          const endpoint = table === 'profiles' ? `/profiles` :
                         table === 'site_settings' ? `/site-settings` :
                         table === 'portfolio_projects' ? `/portfolio-projects` :
                         table === 'blog_posts' ? `/blog-posts` : `/${table}`;
          const result = await apiCall(endpoint);
          let data = result.data;
          data.sort((a: any, b: any) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (opts?.ascending === false) {
              return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
          });
          return { data, error: null };
        } catch (error) {
          return { data: [], error };
        }
      },
      limit: (limit: number) => ({
        single: async () => {
          try {
            const endpoint = table === 'profiles' ? `/profiles` :
                           table === 'site_settings' ? `/site-settings` :
                           table === 'portfolio_projects' ? `/portfolio-projects` :
                           table === 'blog_posts' ? `/blog-posts` : `/${table}`;
            const result = await apiCall(endpoint);
            return { data: result.data[0] || null, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      single: async () => {
        try {
          const endpoint = table === 'profiles' ? `/profiles` :
                         table === 'site_settings' ? `/site-settings` :
                         table === 'portfolio_projects' ? `/portfolio-projects` :
                         table === 'blog_posts' ? `/blog-posts` : `/${table}`;
          const result = await apiCall(endpoint);
          return { data: result.data[0] || null, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      async then(callback: (result: { data: any[]; error: any }) => void) {
        try {
          const endpoint = table === 'profiles' ? `/profiles` :
                         table === 'site_settings' ? `/site-settings` :
                         table === 'portfolio_projects' ? `/portfolio-projects` :
                         table === 'blog_posts' ? `/blog-posts` : `/${table}`;
          const result = await apiCall(endpoint);
          callback({ data: result.data, error: null });
        } catch (error) {
          callback({ data: [], error });
        }
      }
    }),
    insert: (values: any[]) => ({
      select: () => ({
        single: async () => {
          try {
            const endpoint = table === 'portfolio_projects' ? `/admin/portfolio-projects` :
                           table === 'blog_posts' ? `/admin/blog-posts` : `/${table}`;
            const result = await apiCall(endpoint, {
              method: 'POST',
              body: JSON.stringify(values[0]),
            });
            return { data: result.data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    }),
    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            try {
              const endpoint = table === 'profiles' ? `/profiles/${value}` :
                             table === 'site_settings' ? `/site-settings/${value}` :
                             table === 'portfolio_projects' ? `/admin/portfolio-projects/${value}` :
                             table === 'blog_posts' ? `/admin/blog-posts/${value}` : `/${table}/${value}`;
              const result = await apiCall(endpoint, {
                method: 'PATCH',
                body: JSON.stringify(updates),
              });
              return { data: result.data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => async () => {
        try {
          const endpoint = table === 'portfolio_projects' ? `/admin/portfolio-projects/${value}` :
                         table === 'blog_posts' ? `/admin/blog-posts/${value}` : `/${table}/${value}`;
          await apiCall(endpoint, { method: 'DELETE' });
          return { data: null, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    })
  })
};

export const supabase = {
  auth,
  from: db.from
};
