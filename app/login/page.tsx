import { headers } from "next/headers";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginFormClient from './login-form';
import Footer from './Footer';
import SDG6Island from "@/public/sdg6island.svg";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
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
      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();
      // Create a new profile if it doesn't exist
      if (!profile && !profileError) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, role: "user" });
        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          console.log("Profile created successfully");
        }
      }
    }
    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";
 
    const origin = ((await headers()) as Headers).get("origin");
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
      }
    }
 
    return redirect("/login?message=Check email to continue sign in process");
  };

  const signInWithGoogle = async () => {
    "use server";

    const origin = ((await headers()) as Headers).get("origin");
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

  const signInWithGithub = async () => {
    "use server";
    const origin = ((await headers()) as Headers).get("origin");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      return redirect("/login?message=Could not authenticate with GitHub");
    }
    return redirect(data.url);
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
                // style={{ objectFit: 'scale-down' }}
                priority
                className="w-fit px-10"
              />
            </div>
          </div>
          <LoginFormClient
            signIn={signIn}
            signUp={signUp}
            signInWithGoogle={signInWithGoogle}
            signInWithGithub={signInWithGithub}
            message={searchParams?.message}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}