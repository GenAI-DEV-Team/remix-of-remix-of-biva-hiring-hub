import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JobUrlDisplayProps {
  url: string;
  className?: string;
}

export function JobUrlDisplay({ url, className }: JobUrlDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  const fullUrl = `${window.location.origin}${url}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-2 mt-2", className)}>
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground truncate max-w-[280px] sm:max-w-[400px]">
        {fullUrl}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        asChild
      >
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </div>
  );
}
