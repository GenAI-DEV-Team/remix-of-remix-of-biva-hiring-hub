import { Mail, Linkedin, MessageCircle, Facebook, FileSpreadsheet, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileCTABarProps {
  onApplyClick: () => void;
  ctaText?: string;
  ctaIcon?: string;
  linkedin?: string;
}

const getIcon = (iconType?: string): LucideIcon => {
  switch (iconType) {
    case "gmail": return Mail;
    case "zalo": return MessageCircle;
    case "facebook": return Facebook;
    case "linkedin": return Linkedin;
    case "google_form": return FileSpreadsheet;
    default: return Mail;
  }
};

export function MobileCTABar({ 
  onApplyClick, 
  ctaText = "Ứng tuyển", 
  ctaIcon,
  linkedin 
}: MobileCTABarProps) {
  const Icon = getIcon(ctaIcon);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-3 lg:hidden z-50 safe-area-bottom">
      <div className="flex gap-2 max-w-md mx-auto px-1">
        <Button 
          className="flex-1 h-11 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg text-sm" 
          onClick={onApplyClick}
        >
          <Icon className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate">{ctaText}</span>
        </Button>
        {linkedin && (
          <Button asChild variant="outline" className="h-11 px-4 border-accent-blue/30 hover:border-accent-blue/50 shrink-0">
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 text-accent-blue" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}