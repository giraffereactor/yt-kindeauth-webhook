import { Suspense } from "react";
import { Redirector } from "./redirector";

// /redirect
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center mt-32">
          <p className="text-xl font-semibold tracking-tight animate-pulse">
            Loading...
          </p>
        </div>
      }
    >
      <Redirector />
    </Suspense>
  );
}
