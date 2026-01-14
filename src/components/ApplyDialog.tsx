import { Mail, FileText, Briefcase, Link2, MessageCircle, Facebook, Linkedin, FileSpreadsheet, ExternalLink, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export interface PopupContentConfig {
  title: string;
  description: string;
  checklistItems: { title: string; description: string }[];
  buttonText: string;
}

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  jobTitle?: string;
  channelType?: string;
  popupContent?: PopupContentConfig;
  actionUrl?: string;
}

const DEFAULT_CONTENT: Record<string, PopupContentConfig> = {
  gmail: {
    title: "Ứng tuyển qua Email",
    description: "Gửi email kèm các nội dung sau để mình review nhanh hơn nhé!",
    checklistItems: [
      { title: "CV của bạn", description: "PDF hoặc link Google Docs/Notion đều được" },
      { title: "1 thứ chứng minh \"delivery\"", description: "Landing page, content chuyển đổi, campaign, deck, one-pager, case tự làm..." },
      { title: "Link portfolio (nếu có)", description: "Website cá nhân, Behance, hoặc folder Google Drive" },
    ],
    buttonText: "Gửi Email ngay",
  },
  zalo: {
    title: "Ứng tuyển qua Zalo",
    description: "Nhắn tin qua Zalo để trao đổi trực tiếp với mình nhé!",
    checklistItems: [
      { title: "Chuẩn bị sẵn CV", description: "Để gửi nhanh khi được yêu cầu" },
      { title: "Giới thiệu ngắn về bản thân", description: "Kinh nghiệm và mục tiêu của bạn" },
    ],
    buttonText: "Chat Zalo ngay",
  },
  facebook: {
    title: "Ứng tuyển qua Facebook",
    description: "Nhắn tin qua Messenger để trao đổi trực tiếp!",
    checklistItems: [
      { title: "Chuẩn bị sẵn CV", description: "Để gửi nhanh khi được yêu cầu" },
      { title: "Giới thiệu ngắn về bản thân", description: "Kinh nghiệm và mục tiêu của bạn" },
    ],
    buttonText: "Chat Messenger ngay",
  },
  linkedin: {
    title: "Ứng tuyển qua LinkedIn",
    description: "Kết nối và nhắn tin qua LinkedIn!",
    checklistItems: [
      { title: "Cập nhật profile LinkedIn", description: "Đảm bảo thông tin mới nhất" },
      { title: "Gửi lời mời kết nối kèm lời nhắn", description: "Giới thiệu ngắn về bạn và vị trí ứng tuyển" },
    ],
    buttonText: "Mở LinkedIn",
  },
};

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  gmail: Mail,
  zalo: MessageCircle,
  facebook: Facebook,
  linkedin: Linkedin,
};

const CHECKLIST_ICONS = [FileText, Briefcase, Link2];

export function ApplyDialog({ 
  open, 
  onOpenChange, 
  email, 
  jobTitle, 
  channelType = "gmail",
  popupContent,
  actionUrl,
}: ApplyDialogProps) {
  const targetEmail = email || "nhuquan0310.work@gmail.com";
  const subject = encodeURIComponent(`[Ứng tuyển] ${jobTitle || "Vị trí tuyển dụng"} - BIVA`);
  const gmailComposeLink = `https://mail.google.com/mail/?view=cm&to=${targetEmail}&su=${subject}`;

  // Use custom content or default
  const content = popupContent || DEFAULT_CONTENT[channelType] || DEFAULT_CONTENT.gmail;
  const Icon = CHANNEL_ICONS[channelType] || Mail;
  
  // Determine action URL
  const finalActionUrl = actionUrl || (channelType === "gmail" ? gmailComposeLink : "#");
  const isExternalLink = channelType !== "gmail" && actionUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto border-border bg-background/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-3" />

        <div className="space-y-3 sm:space-y-4">
          {content.checklistItems.map((item, index) => {
            const ItemIcon = CHECKLIST_ICONS[index % CHECKLIST_ICONS.length];
            return (
              <div key={index} className="flex gap-3">
                <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center">
                  <ItemIcon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base text-foreground">{item.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-3" />

        <div className="space-y-3">
          <Button asChild className="w-full h-11 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 text-white border-0">
            <a href={finalActionUrl} target="_blank" rel="noopener noreferrer">
              <Icon className="h-4 w-4 mr-2" />
              {content.buttonText}
              {isExternalLink && <ExternalLink className="h-3 w-3 ml-2" />}
            </a>
          </Button>
          {channelType === "gmail" && (
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Gửi tới: <span className="text-foreground font-medium break-all">{targetEmail}</span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}