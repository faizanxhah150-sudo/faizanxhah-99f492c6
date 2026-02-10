import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "faizan150$$$";

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Simple in-memory token store (resets on cold start, but fine for single admin)
const validTokens = new Set<string>();

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return validTokens.has(auth.slice(7));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  // path[0] = "admin", path[1] = action

  const action = path[1] || "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // LOGIN
    if (action === "login" && req.method === "POST") {
      const { username, password } = await req.json();
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = generateToken();
        validTokens.add(token);
        return new Response(JSON.stringify({ token }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All other routes require auth
    if (!isAuthorized(req)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CONTENT CRUD
    if (action === "content") {
      if (req.method === "PUT") {
        const { id, content } = await req.json();
        const { error } = await supabase
          .from("site_content")
          .upsert({ id, content, updated_at: new Date().toISOString() });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // PROJECTS CRUD
    if (action === "projects") {
      if (req.method === "POST") {
        const body = await req.json();
        const { error } = await supabase.from("projects").insert(body);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { id, ...rest } = body;
        const { error } = await supabase.from("projects").update(rest).eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // SKILLS CRUD
    if (action === "skills") {
      if (req.method === "POST") {
        const body = await req.json();
        const { error } = await supabase.from("skills").insert(body);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const { id, ...rest } = body;
        const { error } = await supabase.from("skills").update(rest).eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase.from("skills").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // MESSAGES
    if (action === "messages") {
      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (req.method === "PUT") {
        const { id, is_read } = await req.json();
        const { error } = await supabase.from("messages").update({ is_read }).eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (req.method === "DELETE") {
        const { id } = await req.json();
        const { error } = await supabase.from("messages").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // THEME
    if (action === "theme") {
      if (req.method === "PUT") {
        const body = await req.json();
        const { error } = await supabase
          .from("theme_settings")
          .upsert({ id: "default", ...body, updated_at: new Date().toISOString() });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
