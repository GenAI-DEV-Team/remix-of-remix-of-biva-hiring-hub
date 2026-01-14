import { useState, useEffect } from "react";
import { Check, Copy, ExternalLink, Globe, Loader2, Eye, Rocket, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string;
  isNewJob: boolean;
  isSaving: boolean;
  isSuccess?: boolean;
  onPublish: () => void;
}

export function PublishDialog({
  open,
  onOpenChange,
  previewUrl,
  isNewJob,
  isSaving,
  isSuccess = false,
  onPublish,
}: PublishDialogProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const fullUrl = `${window.location.origin}${previewUrl}`;

  // Auto-close after 3 seconds when success
  useEffect(() => {
    if (isSuccess && open) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onOpenChange(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSuccess, open, onOpenChange]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                {isNewJob ? "Đã publish thành công!" : "Đã cập nhật thành công!"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tự động đóng sau {countdown} giây...
              </p>
            </div>
            
            {/* URL Copy */}
            <div className="w-full space-y-3 mt-2">
              <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-muted rounded-lg overflow-hidden">
                <code className="text-[10px] sm:text-xs font-mono text-foreground flex-1 truncate min-w-0">
                  {fullUrl}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
              <Button variant="outline" className="w-full h-10" asChild>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trang
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Globe className="h-5 w-5 text-primary shrink-0" />
            {isNewJob ? "Publish vị trí mới" : "Cập nhật vị trí"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isNewJob 
              ? "Vị trí tuyển dụng sẽ được đăng công khai" 
              : "Cập nhật các thay đổi lên trang công khai"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Preview URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">URL công khai</label>
            <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-muted rounded-lg overflow-hidden">
              <code className="text-[10px] sm:text-xs font-mono text-foreground flex-1 truncate min-w-0">
                {fullUrl}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Preview Link */}
          {!isNewJob && (
            <Button variant="outline" className="w-full h-10" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Xem trang hiện tại
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          )}

          <Separator />

          {/* Publish Action */}
          <Button
            className="w-full h-11 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 text-white border-0"
            onClick={onPublish}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                {isNewJob ? "Publish" : "Cập nhật"}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {isNewJob 
              ? "Vị trí sẽ hiển thị ngay sau khi publish" 
              : "Các thay đổi sẽ được cập nhật ngay lập tức"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}