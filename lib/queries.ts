import sql from "@/lib/db";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export async function getUserFromKindeId(kindeId: KindeUser["id"]) {
  const [user] = await sql(
    `
    SELECT * FROM public.user
    WHERE kinde_id = ($1)
    `,
    [kindeId]
  );

  return user;
}
