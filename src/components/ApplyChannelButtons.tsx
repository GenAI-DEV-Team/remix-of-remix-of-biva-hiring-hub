import { useState } from "react";
import { Mail, MessageCircle, Facebook, Linkedin, FileSpreadsheet, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplyDialog } from "./ApplyDialog";
import { ApplyFormDialog } from "./ApplyFormDialog";

export interface ChannelConfig {
  gmail: { enabled: boolean; priority: number };
  zalo: { enabled: boolean; phone: string; priority: number };
  facebook: { enabled: boolean; url: string; priority: number };
  linkedin: { enabled: boolean; priority: number };
  google_form: { enabled: boolean; sheet_url: string; priority: number };
}

interface ApplyChannelButtonsProps {
  channels: ChannelConfig;
  email: string;
  linkedin: string;
  jobTitle: string;
  compact?: boolean;
}

export function ApplyChannelButtons({ 
  channels, 
  email, 
  linkedin, 
  jobTitle,
  compact = false 
}: ApplyChannelButtonsProps) {
  const [gmailDialogOpen, setGmailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  // Sort channels by priority and filter enabled ones
  const enabledChannels = Object.entries(channels)
    .filter(([, config]) => config.enabled)
    .sort(([, a], [, b]) => a.priority - b.priority);

  if (enabledChannels.length === 0) {
    return null;
  }

  const getZaloLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://zalo.me/${cleanPhone}`;
  };

  const renderButton = (key: string, config: any, isPrimary: boolean) => {
    const baseClass = isPrimary
      ? "bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25"
      : "border-accent-purple/30 hover:border-accent-purple/50 hover:bg-accent-purple/10";
    
    const sizeClass = compact ? "h-9 text-sm" : "h-10";
    const widthClass = compact ? "flex-1 min-w-[120px]" : "w-full sm:w-auto";

    switch (key) {
      case "gmail":
        return (
          <Button
            key={key}
            onClick={() => setGmailDialogOpen(true)}
            className={`${isPrimary ? baseClass : ""} ${sizeClass} ${widthClass}`}
            variant={isPrimary ? "default" : "outline"}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        );

      case "zalo":
        return (
          <Button
            key={key}
            asChild
            className={`${sizeClass} ${widthClass}`}
            variant={isPrimary ? "default" : "outline"}
          >
            <a href={getZaloLink(config.phone)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Zalo
              <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
            </a>
          </Button>
        );

      case "facebook":
        return (
          <Button
            key={key}
            asChild
            className={`${sizeClass} ${widthClass}`}
            variant={isPrimary ? "default" : "outline"}
          >
            <a href={config.url} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
              <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
            </a>
          </Button>
        );

      case "linkedin":
        return (
          <Button
            key={key}
            asChild
            className={`${sizeClass} ${widthClass}`}
            variant={isPrimary ? "default" : "outline"}
          >
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
              <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
            </a>
          </Button>
        );

      case "google_form":
        return (
          <Button
            key={key}
            onClick={() => setFormDialogOpen(true)}
            className={`${sizeClass} ${widthClass}`}
            variant={isPrimary ? "default" : "outline"}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Điền form
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className={`flex ${compact ? 'flex-wrap gap-2' : 'flex-col sm:flex-row flex-wrap gap-2 sm:gap-3'}`}>
        {enabledChannels.map(([key, config], index) => 
          renderButton(key, config, index === 0)
        )}
      </div>

      <ApplyDialog 
        open={gmailDialogOpen} 
        onOpenChange={setGmailDialogOpen}
        email={email}
        jobTitle={jobTitle}
      />

      {channels.google_form.enabled && (
        <ApplyFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          sheetUrl={channels.google_form.sheet_url}
          jobTitle={jobTitle}
        />
      )}
    </>
  );
}
