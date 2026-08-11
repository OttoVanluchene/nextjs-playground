"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const themes = [
  { value: "light", label: "Use light theme", icon: Sun },
  { value: "system", label: "Use system theme", icon: Laptop },
  { value: "dark", label: "Use dark theme", icon: Moon },
] as const;

const subscribeToMount = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getMountedSnapshot,
    getServerSnapshot,
  );

  const activeTheme = mounted ? theme : undefined;

  return (
    <div
      className="flex items-center rounded-lg border border-border bg-background p-0.5 shadow-xs"
      role="group"
      aria-label="Color theme"
    >
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant={activeTheme === value ? "secondary" : "ghost"}
          size="icon-sm"
          className="rounded-md"
          aria-label={label}
          aria-pressed={activeTheme === value}
          onClick={() => setTheme(value)}
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
