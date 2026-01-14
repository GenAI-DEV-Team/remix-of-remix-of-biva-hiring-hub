import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Facebook, Linkedin, FileSpreadsheet, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface ChannelPopupContent {
  title: string;
  description: string;
  checklistItems: { title: string; description: string }[];
  buttonText: string;
}

export interface ChannelConfig {
  gmail: { enabled: boolean; priority: number; popupContent?: ChannelPopupContent };
  zalo: { enabled: boolean; phone: string; priority: number; popupContent?: ChannelPopupContent };
  facebook: { enabled: boolean; url: string; priority: number; popupContent?: ChannelPopupContent };
  linkedin: { enabled: boolean; priority: number; popupContent?: ChannelPopupContent };
  google_form: { enabled: boolean; sheet_url: string; priority: number; popupContent?: ChannelPopupContent };
  primaryChannel?: string;
}

export const DEFAULT_POPUP_CONTENT: Record<string, ChannelPopupContent> = {
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
  google_form: {
    title: "Điền form ứng tuyển",
    description: "Điền thông tin vào form để ứng tuyển nhanh chóng!",
    checklistItems: [
      { title: "Thông tin cá nhân", description: "Họ tên, email, số điện thoại" },
      { title: "Link CV & Portfolio", description: "Để mình có thể review kỹ hơn" },
    ],
    buttonText: "Gửi ứng tuyển",
  },
};

export const DEFAULT_CHANNELS: ChannelConfig = {
  gmail: { enabled: true, priority: 1 },
  zalo: { enabled: false, phone: "", priority: 2 },
  facebook: { enabled: false, url: "", priority: 3 },
  linkedin: { enabled: false, priority: 4 },
  google_form: { enabled: false, sheet_url: "", priority: 5 },
  primaryChannel: "gmail",
};

interface ChannelConfigEditorProps {
  channels: ChannelConfig;
  onChange: (channels: ChannelConfig) => void;
  email?: string;
  linkedin?: string;
}

interface ChannelItemProps {
  channelKey: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  priority: number;
  isPrimary: boolean;
  onToggle: (enabled: boolean) => void;
  onSetPrimary: () => void;
  popupContent?: ChannelPopupContent;
  onUpdatePopupContent: (content: ChannelPopupContent) => void;
  children?: React.ReactNode;
}

function ChannelItem({ 
  channelKey,
  icon, 
  label, 
  description, 
  enabled, 
  priority, 
  isPrimary,
  onToggle, 
  onSetPrimary,
  popupContent,
  onUpdatePopupContent,
  children 
}: ChannelItemProps) {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const defaultContent = DEFAULT_POPUP_CONTENT[channelKey];
  const content = popupContent || defaultContent;

  const updateChecklistItem = (index: number, field: "title" | "description", value: string) => {
    const newItems = [...content.checklistItems];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdatePopupContent({ ...content, checklistItems: newItems });
  };

  const addChecklistItem = () => {
    onUpdatePopupContent({
      ...content,
      checklistItems: [...content.checklistItems, { title: "", description: "" }],
    });
  };

  const removeChecklistItem = (index: number) => {
    const newItems = content.checklistItems.filter((_, i) => i !== index);
    onUpdatePopupContent({ ...content, checklistItems: newItems });
  };

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-lg border-2 transition-all ${enabled ? (isPrimary ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-muted/20') : 'border-border bg-muted/30 opacity-60'}`}>
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          {/* Radio button to select primary */}
          {enabled && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onSetPrimary}
                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 sm:mt-0 ${
                      isPrimary 
                        ? 'border-primary bg-primary cursor-default' 
                        : 'border-muted-foreground/40 hover:border-primary hover:scale-110 cursor-pointer'
                    }`}
                  >
                    {isPrimary && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isPrimary ? "Đang là CTA chính" : "Click để đặt làm CTA chính"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-medium ${enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {enabled && isPrimary && (
                <Badge className="text-xs shrink-0 bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  CTA chính
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      
      {enabled && children && (
        <div className="pl-12">
          {children}
        </div>
      )}

      {enabled && (
        <Collapsible open={isContentOpen} onOpenChange={setIsContentOpen} className="pl-12">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs w-full justify-between px-3 text-muted-foreground hover:text-foreground">
              <span>Tuỳ chỉnh nội dung popup</span>
              {isContentOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tiêu đề popup</Label>
              <Input
                value={content.title}
                onChange={(e) => onUpdatePopupContent({ ...content, title: e.target.value })}
                placeholder="Ứng tuyển qua..."
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mô tả</Label>
              <Textarea
                value={content.description}
                onChange={(e) => onUpdatePopupContent({ ...content, description: e.target.value })}
                placeholder="Mô tả ngắn..."
                className="text-sm min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Checklist hướng dẫn</Label>
              {content.checklistItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Input
                      value={item.title}
                      onChange={(e) => updateChecklistItem(index, "title", e.target.value)}
                      placeholder="Tiêu đề"
                      className="h-7 text-xs"
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => updateChecklistItem(index, "description", e.target.value)}
                      placeholder="Mô tả"
                      className="h-7 text-xs"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeChecklistItem(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="h-7 text-xs w-full" onClick={addChecklistItem}>
                + Thêm mục
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Text nút CTA</Label>
              <Input
                value={content.buttonText}
                onChange={(e) => onUpdatePopupContent({ ...content, buttonText: e.target.value })}
                placeholder="Gửi ngay"
                className="h-8 text-sm"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function ChannelConfigEditor({ channels, onChange, email, linkedin }: ChannelConfigEditorProps) {
  const updateChannel = <K extends keyof Omit<ChannelConfig, "primaryChannel">>(
    key: K,
    updates: Partial<ChannelConfig[K]>
  ) => {
    onChange({
      ...channels,
      [key]: { ...channels[key], ...updates },
    });
  };

  const setPrimaryChannel = (channelKey: string) => {
    onChange({
      ...channels,
      primaryChannel: channelKey,
    });
  };

  const updatePopupContent = (channelKey: string, content: ChannelPopupContent) => {
    onChange({
      ...channels,
      [channelKey]: { ...channels[channelKey as keyof Omit<ChannelConfig, "primaryChannel">], popupContent: content },
    });
  };

  const primaryChannel = channels.primaryChannel || "gmail";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Kênh ứng tuyển</CardTitle>
        <p className="text-sm text-muted-foreground">
          Bật/tắt các kênh và chọn CTA chính hiển thị trên trang
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Helper text */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2.5">
          <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span>Click vào nút tròn bên trái để chọn CTA chính hiển thị trên header và mobile</span>
        </div>
        {/* Gmail */}
        <ChannelItem
          channelKey="gmail"
          icon={<Mail className="h-4 w-4" />}
          label="Gmail"
          description={email || "Sử dụng email ở mục Thông tin chung"}
          enabled={channels.gmail.enabled}
          priority={channels.gmail.priority}
          isPrimary={primaryChannel === "gmail" && channels.gmail.enabled}
          onToggle={(enabled) => updateChannel("gmail", { enabled })}
          onSetPrimary={() => setPrimaryChannel("gmail")}
          popupContent={channels.gmail.popupContent}
          onUpdatePopupContent={(content) => updatePopupContent("gmail", content)}
        />

        {/* Zalo */}
        <ChannelItem
          channelKey="zalo"
          icon={<MessageCircle className="h-4 w-4" />}
          label="Zalo"
          description="Chat qua Zalo"
          enabled={channels.zalo.enabled}
          priority={channels.zalo.priority}
          isPrimary={primaryChannel === "zalo" && channels.zalo.enabled}
          onToggle={(enabled) => updateChannel("zalo", { enabled })}
          onSetPrimary={() => setPrimaryChannel("zalo")}
          popupContent={channels.zalo.popupContent}
          onUpdatePopupContent={(content) => updatePopupContent("zalo", content)}
        >
          <div className="space-y-1.5">
            <Label className="text-xs">Số điện thoại Zalo</Label>
            <Input
              value={channels.zalo.phone}
              onChange={(e) => updateChannel("zalo", { phone: e.target.value })}
              placeholder="0901234567"
              className="h-8 text-sm"
            />
          </div>
        </ChannelItem>

        {/* Facebook */}
        <ChannelItem
          channelKey="facebook"
          icon={<Facebook className="h-4 w-4" />}
          label="Facebook"
          description="Chat qua Messenger"
          enabled={channels.facebook.enabled}
          priority={channels.facebook.priority}
          isPrimary={primaryChannel === "facebook" && channels.facebook.enabled}
          onToggle={(enabled) => updateChannel("facebook", { enabled })}
          onSetPrimary={() => setPrimaryChannel("facebook")}
          popupContent={channels.facebook.popupContent}
          onUpdatePopupContent={(content) => updatePopupContent("facebook", content)}
        >
          <div className="space-y-1.5">
            <Label className="text-xs">Link Facebook/Messenger</Label>
            <Input
              value={channels.facebook.url}
              onChange={(e) => updateChannel("facebook", { url: e.target.value })}
              placeholder="https://m.me/username hoặc https://facebook.com/username"
              className="h-8 text-sm"
            />
          </div>
        </ChannelItem>

        {/* LinkedIn */}
        <ChannelItem
          channelKey="linkedin"
          icon={<Linkedin className="h-4 w-4" />}
          label="LinkedIn"
          description={linkedin || "Sử dụng LinkedIn ở mục Thông tin chung"}
          enabled={channels.linkedin.enabled}
          priority={channels.linkedin.priority}
          isPrimary={primaryChannel === "linkedin" && channels.linkedin.enabled}
          onToggle={(enabled) => updateChannel("linkedin", { enabled })}
          onSetPrimary={() => setPrimaryChannel("linkedin")}
          popupContent={channels.linkedin.popupContent}
          onUpdatePopupContent={(content) => updatePopupContent("linkedin", content)}
        />

        {/* Google Form */}
        <ChannelItem
          channelKey="google_form"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          label="Form ứng tuyển"
          description="Đẩy dữ liệu vào Google Sheet"
          enabled={channels.google_form.enabled}
          priority={channels.google_form.priority}
          isPrimary={primaryChannel === "google_form" && channels.google_form.enabled}
          onToggle={(enabled) => updateChannel("google_form", { enabled })}
          onSetPrimary={() => setPrimaryChannel("google_form")}
          popupContent={channels.google_form.popupContent}
          onUpdatePopupContent={(content) => updatePopupContent("google_form", content)}
        >
          <div className="space-y-1.5">
            <Label className="text-xs">URL Google Sheet công khai</Label>
            <Input
              value={channels.google_form.sheet_url}
              onChange={(e) => updateChannel("google_form", { sheet_url: e.target.value })}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Sheet cần công khai với quyền edit để nhận dữ liệu
            </p>
          </div>
        </ChannelItem>
      </CardContent>
    </Card>
  );
}