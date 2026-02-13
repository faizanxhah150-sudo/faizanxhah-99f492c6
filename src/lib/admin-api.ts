const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;

export async function adminLogin(username: string, password: string): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return null;
  const { token } = await res.json();
  localStorage.setItem("admin_token", token);
  return token;
}

export function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
}

async function adminFetch(path: string, method: string, body?: any) {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");
  const url = `${SUPABASE_URL}/functions/v1/admin/${path}`;
  console.log("[admin-api] Fetching:", method, url);
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr: any) {
    console.error("[admin-api] Network error:", networkErr);
    throw new Error("Network error - check your connection");
  }
  if (res.status === 401) {
    adminLogout();
    window.location.href = "/admin";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    let errMsg = "Request failed";
    try {
      const err = await res.json();
      errMsg = err.error || errMsg;
    } catch {
      errMsg = `HTTP ${res.status}: ${res.statusText}`;
    }
    console.error("[admin-api] Error:", errMsg);
    throw new Error(errMsg);
  }
  return res.json();
}

export const adminApi = {
  updateContent: (id: string, content: string) => adminFetch("content", "PUT", { id, content }),
  
  addProject: (project: any) => adminFetch("projects", "POST", project),
  updateProject: (project: any) => adminFetch("projects", "PUT", project),
  deleteProject: (id: string) => adminFetch("projects", "DELETE", { id }),
  
  addSkill: (skill: any) => adminFetch("skills", "POST", skill),
  updateSkill: (skill: any) => adminFetch("skills", "PUT", skill),
  deleteSkill: (id: string) => adminFetch("skills", "DELETE", { id }),
  
  getMessages: () => adminFetch("messages", "GET"),
  markMessageRead: (id: string, is_read: boolean) => adminFetch("messages", "PUT", { id, is_read }),
  deleteMessage: (id: string) => adminFetch("messages", "DELETE", { id }),
  
  updateTheme: (settings: any) => adminFetch("theme", "PUT", settings),
};
