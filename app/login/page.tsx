import { headers } from "next/headers";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginFormClient from './login-form';
import Footer from "@/components/Footer";
import SDG6Island from "@/public/sdg6island.svg";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const message = searchParams?.message || null;

  const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && user) {
      // Check if user has a profile and get their role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile && !profileError) {
        // Create a new profile if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, role: "user" });
        
        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          // Update user metadata with the default role
          await supabase.auth.updateUser({
            data: { userRole: "user" }
          });
        }
      } else if (profile) {
        // Update user metadata with the profile role
        await supabase.auth.updateUser({
          data: { userRole: profile.role }
        });
      }
    }

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";
 
    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
 
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
 
    if (error) {
      console.log(error);
      return redirect("/login?message=Could not sign up user");
    }
 
    if (data.user) {
      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, role: 'user' });
 
      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        // Update user metadata with the default role
        await supabase.auth.updateUser({
          data: { userRole: "user" }
        });
      }
    }
 
    return redirect("/login?message=Check email to continue sign in process");
  };

  const signInWithGoogle = async () => {
    "use server";
    const origin = (await headers()).get("origin");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      return redirect("/login?message=Could not authenticate with Google");
    }
    return redirect(data.url);
  };

  const handlePasswordReset = async (email: string) => {
    "use server";
    const supabase = createClient();
    const origin = (await headers()).get("origin");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`, // Redirects to the password update page
      });

      if (error) {
        console.error("Error sending password reset email:", error.message);
        throw new Error("Failed to send password reset email. Please try again.");
      }

      console.log("Password reset email sent successfully.");
    } catch (error) {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="hidden md:block w-1/2 relative bg-blue-900">
            <div className="absolute inset-0">
              <Image
                src={SDG6Island}
                alt="SDG 6 Island"
                fill
                priority
                className="w-fit px-10"
              />
            </div>
          </div>
          <LoginFormClient
            signIn={signIn}
            signUp={signUp}
            signInWithGoogle={signInWithGoogle}
            message={message || undefined}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}