import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { FakeInvoice } from "./fake-invoice";

const statusClassName: Record<FakeInvoice["status"], string> = {
  Paid: "border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Due: "border-amber-500/35 bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Overdue: "border-rose-500/35 bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

type InvoiceCardProps = {
  invoice: FakeInvoice;
  className?: string;
};

export function InvoiceCard({ invoice, className }: InvoiceCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="border-b">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg">Invoice {invoice.number}</CardTitle>
          <Badge variant="outline" className={cn(statusClassName[invoice.status])}>
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-(--card-spacing)">
        <dl className="space-y-3">
          <InvoiceField label="Customer" value={invoice.customer} />
          <InvoiceField label="Amount due" value={invoice.amount} emphasize />
          <InvoiceField label="Due date" value={invoice.dueDate} />
        </dl>
      </CardContent>
    </Card>
  );
}

function InvoiceField({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className={cn("font-medium tabular-nums text-right", emphasize && "text-base")}>
        {value}
      </dd>
    </div>
  );
}
