import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserRole(supabase: SupabaseClient) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
   
    if (userError) throw userError;
    if (!user) return null;

    // Try to get role from profiles first
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id);

    if (!profileError && profiles && profiles.length > 0) {
      return profiles[0].role;
    }

    // If no profile found, try user_roles table
    const { data: userRoles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (!roleError && userRoles && userRoles.length > 0) {
      return userRoles[0].role;
    }

    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
}