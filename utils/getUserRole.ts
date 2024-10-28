import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserRole(supabase: SupabaseClient): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) return null;

    // First, try to get the role from the profiles table
    let { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching from profiles:", error);
      
      // If there's an error with profiles, try the user_roles table
      ({ data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single());

      if (error) {
        console.error("Error fetching from user_roles:", error);
        return null;
      }
    }

    return data?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}