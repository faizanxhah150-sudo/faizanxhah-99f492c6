import { externalSupabase } from './supabase-external';

export async function adminLogin(email: string, password: string): Promise<boolean> {
  const { error } = await externalSupabase.auth.signInWithPassword({ email, password });
  return !error;
}

export function adminLogout() {
  externalSupabase.auth.signOut();
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const { data: { session } } = await externalSupabase.auth.getSession();
  return !!session;
}

export const adminApi = {
  updateContent: async (sectionKey: string, content: string) => {
    const { error } = await externalSupabase
      .from('site_content')
      .upsert(
        { section_key: sectionKey, content, updated_at: new Date().toISOString() },
        { onConflict: 'section_key' }
      );
    if (error) throw error;
  },

  addProject: async (project: any) => {
    const { error } = await externalSupabase.from('projects').upsert(project);
    if (error) throw error;
  },
  updateProject: async (project: any) => {
    const { error } = await externalSupabase.from('projects').upsert(project);
    if (error) throw error;
  },
  deleteProject: async (id: string) => {
    const { error } = await externalSupabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  addSkill: async (skill: any) => {
    const { error } = await externalSupabase.from('skills').insert(skill);
    if (error) throw error;
  },
  updateSkill: async (skill: any) => {
    const { id, ...rest } = skill;
    const { error } = await externalSupabase.from('skills').update(rest).eq('id', id);
    if (error) throw error;
  },
  deleteSkill: async (id: string) => {
    const { error } = await externalSupabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },

  getMessages: async () => {
    const { data, error } = await externalSupabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  markMessageRead: async (id: string, is_read: boolean) => {
    const { error } = await externalSupabase.from('messages').update({ is_read }).eq('id', id);
    if (error) throw error;
  },
  deleteMessage: async (id: string) => {
    const { error } = await externalSupabase.from('messages').delete().eq('id', id);
    if (error) throw error;
  },

  updateTheme: async (settings: any) => {
    const { error } = await externalSupabase
      .from('theme_settings')
      .upsert({ id: 'default', ...settings, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
};
