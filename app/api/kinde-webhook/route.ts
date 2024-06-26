import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import sql from "@/lib/db";

const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const jwtDecoded = jwt.decode(token, { complete: true });

    if (!jwtDecoded) {
      return NextResponse.json({
        status: 500,
        statusText: "error decoding jwt",
      });
    }

    const header = jwtDecoded.header;
    const kid = header.kid;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey) as JwtPayload;

    // Handle various events
    switch (event?.type) {
      case "user.created":
        // create a user in our database
        const user = event.data.user;

        const kindeId = user.id;
        const email = user.email;
        const first_name = user.first_name ?? null;
        const last_name = user.last_name ?? null;

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        const [newUser] = await sql(
          `
          INSERT INTO public.user (kinde_id, email, first_name, last_name)
          VALUES ($1, $2, $3, $4)
          RETURNING user_id
        `,
          [kindeId, email, first_name, last_name]
        );

        console.log("[newUser]", newUser);

        break;
      default:
        console.log("event not handled", event.type);
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 200, statusText: "success" });
}
