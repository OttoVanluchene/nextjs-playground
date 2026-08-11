import { connection } from "next/server";
import { redirect } from "next/navigation";

export default async function LoadingSkeletonPage() {
  await connection();
  redirect(`/experiments/nextjs/loading-skeleton/invoice/${Date.now()}`);
}
