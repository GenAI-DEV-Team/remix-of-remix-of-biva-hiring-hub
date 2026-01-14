import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  variant?: "desktop" | "mobile";
}

export function TableOfContents({ items, variant }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  // Desktop sidebar version - only show on lg+ screens
  if (variant === "desktop") {
    return (
      <nav className="hidden lg:block sticky top-24 w-56 shrink-0 self-start">
        <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <List className="h-4 w-4" />
          Mục lục
        </div>
        <ul className="space-y-1 border-l border-border pl-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "block w-full text-left text-xs py-1.5 transition-colors hover:text-accent-purple",
                  item.level === 3 && "pl-3",
                  activeId === item.id
                    ? "text-accent-purple font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // Mobile collapsible version - only show on < lg screens
  if (variant === "mobile") {
    return (
      <div className="lg:hidden mb-4 sm:mb-6 border border-border rounded-lg bg-surface-subtle/30 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between px-3 sm:px-4 py-2.5 sm:py-3 h-auto font-medium text-sm"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Mục lục
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isOpen && (
          <ul className="px-3 sm:px-4 pb-3 space-y-0.5 border-t border-border pt-2 max-h-[50vh] overflow-y-auto">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "block w-full text-left text-sm py-2 transition-colors rounded-md px-2",
                    item.level === 3 && "pl-4",
                    activeId === item.id
                      ? "text-accent-purple font-medium bg-accent-purple/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  )}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Fallback - should not reach here
  return null;
}