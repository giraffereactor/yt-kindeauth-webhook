import sql from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

export const Redirector = async () => {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) notFound();

  const [user] = await sql(
    `
    SELECT user_id FROM public.user
    WHERE kinde_id = ($1)
    `,
    [kindeUser.id]
  );

  if (user?.user_id) redirect("/dashboard");

  let count = 0;
  while (count < 3) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const [user] = await sql(
      `
      SELECT user_id FROM public.user
      WHERE kinde_id = ($1)
      `,
      [kindeUser.id]
    );

    if (user?.user_id) redirect("/dashboard");

    count++;
  }

  notFound();
};
