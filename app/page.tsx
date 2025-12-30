import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Suspense>
          <AuthButton />
          <ThemeSwitcher />
        </Suspense>
      </div>
    </main>
  );
}
