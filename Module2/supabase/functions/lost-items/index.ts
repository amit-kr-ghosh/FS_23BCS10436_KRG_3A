import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LostItemPayload {
  itemName: string;
  description: string;
  lastSeenLocation: string;
  category: 'ID Card' | 'Book' | 'Gadget' | 'Accessory' | 'Misc';
  imageUrl?: string;
  status?: 'open' | 'found' | 'closed';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Get auth token from header if present
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const url = new URL(req.url);
    const path = url.pathname.replace('/lost-items', '');
    const method = req.method;

    // GET /lost-items - Get all lost items with filters
    if (method === "GET" && path === "") {
      const keyword = url.searchParams.get("keyword");
      const category = url.searchParams.get("category");
      const status = url.searchParams.get("status");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "10");
      const offset = (page - 1) * limit;

      let query = supabase
        .from("lost_items")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (category) {
        query = query.eq("category", category);
      }
      if (status) {
        query = query.eq("status", status);
      }
      if (keyword) {
        query = query.or(`item_name.ilike.%${keyword}%,description.ilike.%${keyword}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          data, 
          count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // GET /lost-items/my - Get current user's lost items
    if (method === "GET" && path === "/my") {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } = await supabase
        .from("lost_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // GET /lost-items/:id - Get single lost item
    if (method === "GET" && path.startsWith("/")) {
      const id = path.substring(1);

      const { data, error } = await supabase
        .from("lost_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return new Response(
          JSON.stringify({ error: "Lost item not found" }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(JSON.stringify({ data }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // POST /lost-items - Create new lost item
    if (method === "POST" && path === "") {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const payload: LostItemPayload = await req.json();

      // Validation
      if (!payload.itemName || !payload.description || !payload.lastSeenLocation || !payload.category) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } = await supabase
        .from("lost_items")
        .insert({
          user_id: user.id,
          item_name: payload.itemName,
          description: payload.description,
          last_seen_location: payload.lastSeenLocation,
          category: payload.category,
          image_url: payload.imageUrl || null,
          status: payload.status || 'open',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // PUT /lost-items/:id - Update lost item
    if (method === "PUT" && path.startsWith("/")) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const id = path.substring(1);
      const payload: LostItemPayload = await req.json();

      const { data, error } = await supabase
        .from("lost_items")
        .update({
          item_name: payload.itemName,
          description: payload.description,
          last_seen_location: payload.lastSeenLocation,
          category: payload.category,
          image_url: payload.imageUrl,
          status: payload.status,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return new Response(
            JSON.stringify({ error: "Lost item not found or unauthorized" }),
            {
              status: 404,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
        throw error;
      }

      return new Response(JSON.stringify({ data }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // DELETE /lost-items/:id - Delete lost item
    if (method === "DELETE" && path.startsWith("/")) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const id = path.substring(1);

      const { error } = await supabase
        .from("lost_items")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: "Lost item deleted successfully" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Route not found
    return new Response(
      JSON.stringify({ error: "Route not found" }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});