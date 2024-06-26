import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { getUserFromKindeId } from "@/lib/queries";

// /dashboard
export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated();

  const kindeUser = await getUser();

  if (isUserAuthenticated === false || kindeUser === null) {
    return (
      <main>
        <h1 className="text-2xl font-bold tracking-tight">
          You are not authenticated
        </h1>

        <div className="mt-4">
          Click{" "}
          <Button variant="link" className="px-0.5" asChild>
            <LoginLink>here</LoginLink>
          </Button>{" "}
          to sign in.
        </div>
      </main>
    );
  }

  const user = await getUserFromKindeId(kindeUser.id);

  return (
    <main>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome [{user.email}] to the Dashboard Page
      </h1>

      <div className="mt-4">
        <Button variant="destructive" size="lg" asChild>
          <LogoutLink>Sign out</LogoutLink>
        </Button>
      </div>
    </main>
  );
}
