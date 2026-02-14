import { externalSupabase } from "@/lib/supabase-external";
import { useQuery } from "@tanstack/react-query";

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await externalSupabase.from("site_content").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((item: any) => { map[item.id] = item.content; });
      return map;
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useThemeSettings() {
  return useQuery({
    queryKey: ["theme-settings"],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("theme_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
