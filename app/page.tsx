import { Button } from "@/components/ui/button";
import sql from "@/lib/db";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

// /
export default async function Page() {
  const allUsers = await sql`SELECT public.user.* FROM public.user`;
  // console.log(allUsers);

  const { isAuthenticated } = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated();

  return (
    <main>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome to the Home Page
      </h1>

      <div className="flex gap-x-2 mt-4">
        {isUserAuthenticated ? (
          <>
            <Button size="lg" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" asChild>
              <LoginLink>Sign in</LoginLink>
            </Button>

            <Button size="lg" asChild>
              <RegisterLink>Sign up</RegisterLink>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
