import { useState, useEffect } from "react";
import { adminLogin, adminLogout, adminApi } from "@/lib/admin-api";
import { externalSupabase } from "@/lib/supabase-external";
import { useSiteContent, useProjects, useSkills, useThemeSettings } from "@/hooks/use-portfolio-data";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LogOut, FileText, FolderOpen, BarChart3, Mail, Settings,
  Plus, Trash2, Edit2, Save, X, Eye, EyeOff, Upload, Menu
} from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    externalSupabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setCheckingAuth(false);
    });
    const { data: { subscription } } = externalSupabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    const success = await adminLogin(email, password);
    setLoggingIn(false);
    if (success) {
      setIsLoggedIn(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!isLoggedIn) {
    return <LoginScreen onSubmit={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} loading={loggingIn} />;
  }

  const tabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "skills", label: "Skills", icon: BarChart3 },
    { id: "messages", label: "Inbox", icon: Mail },
    { id: "theme", label: "Theme", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass-card text-primary"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 glass-card border-r border-border/50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-border/50">
          <h1 className="font-heading text-lg font-bold neon-text">Admin Panel</h1>
          <p className="text-muted-foreground text-xs mt-1">Manage your portfolio</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-auto">
        {activeTab === "content" && <ContentManager queryClient={queryClient} />}
        {activeTab === "projects" && <ProjectManager queryClient={queryClient} />}
        {activeTab === "skills" && <SkillManager queryClient={queryClient} />}
        {activeTab === "messages" && <MessageInbox />}
        {activeTab === "theme" && <ThemeManager queryClient={queryClient} />}
      </main>
    </div>
  );
};

// Login Screen
function LoginScreen({ onSubmit, email, setEmail, password, setPassword, loading }: any) {
  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold neon-text text-center mb-2">Admin Login</h1>
        <p className="text-muted-foreground text-sm text-center mb-8">Enter your credentials</p>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button type="submit" disabled={loading} className="neon-button w-full py-3 rounded-lg text-sm disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Content Manager
function ContentManager({ queryClient }: { queryClient: any }) {
  const { data: content = {} } = useSiteContent();
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const contentItems = [
    { id: "hero_title", label: "Hero Title" },
    { id: "hero_subtitle", label: "Hero Subtitle" },
    { id: "hero_description", label: "Hero Description" },
    { id: "about_text", label: "About Text" },
    { id: "location", label: "Location" },
    { id: "contact_heading", label: "Contact Heading" },
    { id: "contact_subtext", label: "Contact Subtext" },
  ];

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `profile/${Date.now()}-${file.name}`;
      const { error } = await externalSupabase.storage.from("portfolio-images").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = externalSupabase.storage.from("portfolio-images").getPublicUrl(path);
      await adminApi.updateContent("profile_image_url", publicUrl);
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Profile photo updated!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(`Upload failed: ${err?.message || "Unknown error"}`);
    }
    setUploading(false);
  };

  const handleSave = async (id: string) => {
    setSaving(id);
    try {
      await adminApi.updateContent(id, editing[id] ?? content[id] ?? "");
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Content updated!");
      setEditing((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(`Failed to save: ${err?.message || "Unknown error"}`);
    }
    setSaving(null);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Site Content</h2>

      {/* Profile Photo Upload */}
      <div className="glass-card p-5 mb-6">
        <label className="text-sm font-medium text-primary mb-3 block">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
            <img
              src={content.profile_image_url || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <label className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer inline-flex">
              <Upload size={14} /> {uploading ? "Uploading..." : "Change Photo"}
              <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" disabled={uploading} />
            </label>
            <p className="text-muted-foreground text-xs mt-2">Select from gallery to update permanently</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {contentItems.map((item) => (
          <div key={item.id} className="glass-card p-5">
            <label className="text-sm font-medium text-primary mb-2 block">{item.label}</label>
            {item.id.includes("description") || item.id.includes("text") || item.id.includes("subtext") ? (
              <textarea
                value={editing[item.id] ?? content[item.id] ?? ""}
                onChange={(e) => setEditing({ ...editing, [item.id]: e.target.value })}
                rows={3}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={editing[item.id] ?? content[item.id] ?? ""}
                onChange={(e) => setEditing({ ...editing, [item.id]: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              />
            )}
            {(editing[item.id] !== undefined && editing[item.id] !== content[item.id]) && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleSave(item.id)} disabled={saving === item.id} className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50">
                  <Save size={14} /> {saving === item.id ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing((prev) => { const n = { ...prev }; delete n[item.id]; return n; })} className="px-4 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Project Manager
function ProjectManager({ queryClient }: { queryClient: any }) {
  const { data: projects = [] } = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tech_stack: "", live_url: "", github_url: "", image_url: "", category: "" });
  const [showAdd, setShowAdd] = useState(false);

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      tech_stack: (p.tech_stack || []).join(", "),
      live_url: p.live_url || "",
      github_url: p.github_url || "",
      image_url: p.image_url || "",
      category: p.category || "",
    });
  };

  const handleSave = async () => {
    const data = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      image_url: form.image_url || null,
      category: form.category || null,
    };
    try {
      if (editingId) {
        await adminApi.updateProject({ id: editingId, ...data });
      } else {
        await adminApi.addProject(data);
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(editingId ? "Project updated!" : "Project added!");
      setEditingId(null);
      setShowAdd(false);
      setForm({ title: "", description: "", tech_stack: "", live_url: "", github_url: "", image_url: "", category: "" });
    } catch (err: any) {
      console.error("Project save error:", err);
      toast.error(`Failed to save project: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteProject(id);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    } catch (err: any) {
      toast.error(`Failed to delete: ${err?.message || "Unknown error"}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `projects/${Date.now()}-${file.name}`;
    const { error } = await externalSupabase.storage.from("portfolio-images").upload(path, file);
    if (error) { toast.error("Upload failed"); return; }
    const { data: { publicUrl } } = externalSupabase.storage.from("portfolio-images").getPublicUrl(path);
    setForm({ ...form, image_url: publicUrl });
    toast.success("Image uploaded!");
  };

  const isEditing = editingId || showAdd;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Projects</h2>
        {!isEditing && (
          <button onClick={() => setShowAdd(true)} className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1">
            <Plus size={14} /> Add Project
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-primary">{editingId ? "Edit Project" : "New Project"}</h3>
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary resize-none" />
          <input type="text" placeholder="Category (e.g. Web App)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <input type="text" placeholder="Tech stack (comma separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <input type="text" placeholder="Live URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <input type="text" placeholder="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Project Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-muted-foreground" />
            {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-20 rounded object-cover" />}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1"><Save size={14} /> Save</button>
            <button onClick={() => { setEditingId(null); setShowAdd(false); }} className="px-6 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(projects as any[]).map((p: any) => (
          <div key={p.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {p.image_url && <img src={p.image_url} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />}
              <div className="min-w-0">
                <p className="text-foreground font-medium text-sm truncate">{p.title}</p>
                <p className="text-muted-foreground text-xs truncate">{p.description}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 ml-3">
              <button onClick={() => startEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skill Manager
function SkillManager({ queryClient }: { queryClient: any }) {
  const { data: skills = [] } = useSkills();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "", proficiency: 50 });
  const [showAdd, setShowAdd] = useState(false);

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await adminApi.updateSkill({ id: editingId, ...form });
      } else {
        await adminApi.addSkill(form);
      }
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(editingId ? "Skill updated!" : "Skill added!");
      setEditingId(null);
      setShowAdd(false);
      setForm({ name: "", category: "", proficiency: 50 });
    } catch (err: any) {
      toast.error(`Failed to save: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteSkill(id);
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
    } catch (err: any) {
      toast.error(`Failed to delete: ${err?.message || "Unknown error"}`);
    }
  };

  const isEditing = editingId || showAdd;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Skills</h2>
        {!isEditing && (
          <button onClick={() => setShowAdd(true)} className="neon-button px-4 py-2 rounded-lg text-xs flex items-center gap-1">
            <Plus size={14} /> Add Skill
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <input type="text" placeholder="Skill name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <input type="text" placeholder="Category (e.g. Frontend)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary" />
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Proficiency: {form.proficiency}%</label>
            <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full accent-primary" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1"><Save size={14} /> Save</button>
            <button onClick={() => { setEditingId(null); setShowAdd(false); }} className="px-6 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(skills as any[]).map((s: any) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium text-sm">{s.name}</p>
              <p className="text-muted-foreground text-xs">{s.category} · {s.proficiency}%</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Message Inbox
function MessageInbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await adminApi.getMessages();
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    }
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  const toggleRead = async (id: string, is_read: boolean) => {
    await adminApi.markMessageRead(id, !is_read);
    loadMessages();
  };

  const handleDelete = async (id: string) => {
    await adminApi.deleteMessage(id);
    toast.success("Message deleted");
    loadMessages();
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Inbox {unreadCount > 0 && <span className="text-primary text-sm">({unreadCount} unread)</span>}
        </h2>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="mx-auto text-muted-foreground/30 mb-3" size={40} />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m: any) => (
            <div key={m.id} className={`glass-card p-5 ${!m.is_read ? "border-primary/30" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-foreground font-medium text-sm">{m.name}</p>
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-primary text-xs mb-2">{m.email}</p>
                  <p className="text-muted-foreground text-sm">{m.message}</p>
                  <p className="text-muted-foreground/50 text-xs mt-2">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => toggleRead(m.id, m.is_read)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    {m.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Theme Manager
function ThemeManager({ queryClient }: { queryClient: any }) {
  const { data: theme } = useThemeSettings();
  const [color, setColor] = useState("#39FF14");
  const [intensity, setIntensity] = useState(1.0);

  useEffect(() => {
    if (theme) {
      setColor((theme as any).accent_color || "#39FF14");
      setIntensity((theme as any).accent_intensity || 1.0);
    }
  }, [theme]);

  const handleSave = async () => {
    try {
      await adminApi.updateTheme({ accent_color: color, accent_intensity: intensity });
      queryClient.invalidateQueries({ queryKey: ["theme-settings"] });
      toast.success("Theme updated!");
    } catch {
      toast.error("Failed to save theme");
    }
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Theme Settings</h2>
      <div className="glass-card p-6 space-y-6 max-w-md">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Accent Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-2 text-foreground text-sm font-mono focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Glow Intensity: {intensity.toFixed(1)}</label>
          <input type="range" min={0} max={2} step={0.1} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <button onClick={handleSave} className="neon-button px-6 py-2 rounded-lg text-xs flex items-center gap-1">
          <Save size={14} /> Save Theme
        </button>
      </div>
    </div>
  );
}

export default Admin;
