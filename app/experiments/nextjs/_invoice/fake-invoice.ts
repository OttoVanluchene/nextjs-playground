export type FakeInvoice = {
  number: string;
  status: "Paid" | "Due" | "Overdue";
  customer: string;
  amount: string;
  dueDate: string;
};

const INVOICE: FakeInvoice = {
  number: "INV-1042",
  status: "Due",
  customer: "Northwind Labs",
  amount: "$1,280.00",
  dueDate: "Aug 25, 2026",
};

const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Fake invoice fetch with a fixed delay so loading UI is easy to see. */
export async function getFakeInvoice(): Promise<FakeInvoice> {
  await sleep(DELAY_MS);
  return INVOICE;
}
