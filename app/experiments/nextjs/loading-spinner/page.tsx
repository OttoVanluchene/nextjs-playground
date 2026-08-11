import { connection } from "next/server";
import { redirect } from "next/navigation";

export default async function LoadingSpinnerPage() {
  await connection();
  redirect(`/experiments/nextjs/loading-spinner/invoice/${Date.now()}`);
}
