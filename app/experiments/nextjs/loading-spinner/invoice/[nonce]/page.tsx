import { connection } from "next/server";

import { getFakeInvoice } from "@/app/experiments/nextjs/_invoice/fake-invoice";
import { InvoiceCard } from "@/app/experiments/nextjs/_invoice/invoice-card";

export default async function InvoicePage() {
  await connection();
  const invoice = await getFakeInvoice();

  return <InvoiceCard invoice={invoice} />;
}
