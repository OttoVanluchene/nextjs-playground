import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Open", value: "12" },
  { label: "Paid this month", value: "48" },
  { label: "Overdue", value: "3" },
] as const;

const RECENT = [
  { number: "INV-1042", customer: "Northwind Labs", amount: "$1,280.00", active: true },
  { number: "INV-1041", customer: "Brightside Co", amount: "$640.00", active: false },
  { number: "INV-1038", customer: "Harbor Studio", amount: "$2,150.00", active: false },
  { number: "INV-1035", customer: "Cedar & Oak", amount: "$420.00", active: false },
] as const;

type InvoiceWorkspaceProps = {
  children: ReactNode;
  actions?: ReactNode;
};

/**
 * Instant server-rendered billing shell. Only `children` (the page slot) suspends —
 * keep this free of awaits so loading.tsx never blocks the chrome.
 */
export function InvoiceWorkspace({ children, actions }: InvoiceWorkspaceProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div>
          <p className="font-medium text-sm">Billing</p>
          <p className="text-muted-foreground text-xs leading-5">
            Shell is server-rendered and stays up while the detail card loads.
          </p>
        </div>
        {actions}
      </div>

      <div className="gap-3 grid grid-cols-3 border-b px-4 sm:px-5 py-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <p className="text-muted-foreground text-xs truncate">{stat.label}</p>
            <p className="mt-0.5 font-semibold text-lg tabular-nums tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="gap-0 grid md:grid-cols-[minmax(0,14rem)_1fr] lg:grid-cols-[minmax(0,16rem)_1fr]">
        <aside className="md:border-r border-b md:border-b-0">
          <p className="px-4 sm:px-5 pt-3 pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Recent
          </p>
          <ul className="pb-2">
            {RECENT.map((item) => (
              <li key={item.number}>
                <div
                  className={cn(
                    "px-4 sm:px-5 py-2.5",
                    item.active && "bg-muted/60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm tabular-nums">{item.number}</span>
                    {item.active ? (
                      <Badge variant="outline" className="font-normal text-[10px]">
                        Selected
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-muted-foreground text-xs truncate">
                    {item.customer}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums">{item.amount}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="p-4 sm:p-5">
          <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Detail
          </p>
          {children}
        </section>
      </div>
    </div>
  );
}
