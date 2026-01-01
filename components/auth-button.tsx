import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function AuthButton() {
  const supabase = await createClient();

  // getUser() will be slower.
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (user) {
    return redirect("/dashboard");
  }
}
