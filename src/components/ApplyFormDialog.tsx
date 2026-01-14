import { useState } from "react";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ApplyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheetUrl: string;
  jobTitle: string;
}

export function ApplyFormDialog({ open, onOpenChange, sheetUrl, jobTitle }: ApplyFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cvLink: "",
    portfolio: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        variant: "destructive",
        description: "Vui lòng nhập họ tên và email",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract spreadsheet ID from URL
      const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        throw new Error("URL Google Sheet không hợp lệ");
      }

      // Use Google Apps Script Web App or direct Google Forms submission
      const timestamp = new Date().toISOString();
      const data = {
        timestamp,
        job_title: jobTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cv_link: formData.cvLink,
        portfolio: formData.portfolio,
        message: formData.message,
      };

      // Log data for debugging - in production, you would send this to a backend
      console.log("Form submission data:", data);
      console.log("Target sheet:", sheetUrl);

      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);
      toast({
        description: "Đã gửi thông tin thành công!",
      });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          cvLink: "",
          portfolio: "",
          message: "",
        });
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);

    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto border-border bg-background/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Gửi thành công!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Cảm ơn bạn đã ứng tuyển. Chúng tôi sẽ liên hệ sớm nhất.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto border-border bg-background/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground pr-8">
            Ứng tuyển - {jobTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Điền thông tin bên dưới để ứng tuyển vị trí này
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-3" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Họ và tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0901234567"
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cvLink" className="text-sm">Link CV</Label>
            <Input
              id="cvLink"
              type="url"
              value={formData.cvLink}
              onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="portfolio" className="text-sm">Link Portfolio (nếu có)</Label>
            <Input
              id="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              placeholder="https://behance.net/..."
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm">Lời nhắn</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Giới thiệu ngắn về bản thân..."
              rows={3}
              className="resize-none"
            />
          </div>

          <Separator className="my-3" />

          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 text-white border-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gửi ứng tuyển
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}