import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !isLight);
  }, [isLight]);

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isLight}
        onCheckedChange={setIsLight}
        className="data-[state=checked]:bg-blue-500"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}
