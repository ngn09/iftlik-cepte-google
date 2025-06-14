
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name || !role) {
      return new Response(JSON.stringify({ error: "Gerekli alanlar eksik: email, password, full_name, role." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (password.length < 6) {
        return new Response(JSON.stringify({ error: "Şifre en az 6 karakter olmalıdır." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Create a Supabase client with the service_role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // You might want to set this to false for easier testing
    });

    if (authError) {
      console.error("Auth user creation error:", authError);
      throw authError;
    }
    
    if (!authData.user) {
        throw new Error("Kullanıcı oluşturulamadı.");
    }

    const userId = authData.user.id;

    // 2. Create the user's profile in public.profiles
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      email,
      full_name,
      role,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // If profile creation fails, we should probably delete the auth user
      // to avoid orphaned users.
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw profileError;
    }

    return new Response(JSON.stringify({ message: "Kullanıcı başarıyla oluşturuldu." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
