import { useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, Phone, Linkedin, ExternalLink, Sparkles, Loader2, ArrowLeft, ChevronRight, MessageCircle, Facebook, FileSpreadsheet, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableOfContents } from "@/components/TableOfContents";
import { MobileCTABar } from "@/components/MobileCTABar";
import { CopyButton } from "@/components/CopyButton";
import { ApplyDialog } from "@/components/ApplyDialog";
import { ApplyFormDialog } from "@/components/ApplyFormDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useJobPostings } from "@/hooks/useJobPostings";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const JobDetail = () => {
  const { departmentSlug, jobSlug } = useParams<{ departmentSlug: string; jobSlug: string }>();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { jobPostings, loading, error } = useJobPostings({ jobSlug });

  const job = jobPostings[0];
  const jobInfo = job?.jobInfo;
  const sections = job?.sections || [];
  const channels = job?.channels;

  const tocItems = sections.map((s) => ({
    id: s.id,
    title: s.title,
    level: 2,
  }));
  tocItems.push({ id: "ung-tuyen", title: "Ứng tuyển", level: 2 });

  const linkedinUsername = jobInfo?.linkedin
    ? jobInfo.linkedin
        .replace("https://www.linkedin.com/in/", "")
        .replace("https://linkedin.com/in/", "")
        .replace("/", "")
    : "";

  // Get enabled channels sorted by priority
  const enabledChannels = channels
    ? Object.entries(channels)
        .filter(([key, config]) => key !== "primaryChannel" && typeof config === "object" && "enabled" in config && config.enabled)
        .sort(([, a], [, b]) => {
          const aPriority = typeof a === "object" && "priority" in a ? a.priority : 999;
          const bPriority = typeof b === "object" && "priority" in b ? b.priority : 999;
          return aPriority - bPriority;
        })
    : [];

  const getZaloLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://zalo.me/${cleanPhone}`;
  };

  // Get primary CTA - use configured primaryChannel or first enabled
  const configuredPrimary = channels?.primaryChannel;
  const primaryChannelConfig = configuredPrimary && channels ? channels[configuredPrimary as keyof Omit<typeof channels, "primaryChannel">] : null;
  const isPrimaryEnabled = primaryChannelConfig && typeof primaryChannelConfig === "object" && "enabled" in primaryChannelConfig && primaryChannelConfig.enabled;
  const primaryChannel = isPrimaryEnabled ? configuredPrimary : enabledChannels[0]?.[0];
  
  // Get popup content for primary channel
  const primaryPopupContent = primaryChannel && channels 
    ? (channels[primaryChannel as keyof Omit<typeof channels, "primaryChannel">] as any)?.popupContent 
    : undefined;
  
  const getPrimaryChannelText = () => {
    switch (primaryChannel) {
      case "gmail": return "Ứng tuyển qua Email";
      case "zalo": return "Ứng tuyển qua Zalo";
      case "facebook": return "Ứng tuyển qua Facebook";
      case "linkedin": return "Ứng tuyển qua LinkedIn";
      case "google_form": return "Điền form ứng tuyển";
      default: return "Ứng tuyển ngay";
    }
  };

  const getPrimaryChannelIcon = () => {
    switch (primaryChannel) {
      case "gmail": return Mail;
      case "zalo": return MessageCircle;
      case "facebook": return Facebook;
      case "linkedin": return Linkedin;
      case "google_form": return FileSpreadsheet;
      default: return Mail;
    }
  };

  // Get action URL for primary channel
  const getPrimaryActionUrl = () => {
    switch (primaryChannel) {
      case "zalo": return channels?.zalo.phone ? getZaloLink(channels.zalo.phone) : undefined;
      case "facebook": return channels?.facebook.url || undefined;
      case "linkedin": return jobInfo?.linkedin || undefined;
      default: return undefined;
    }
  };

  const handlePrimaryCTA = () => {
    if (primaryChannel === "google_form") {
      setFormDialogOpen(true);
    } else {
      // All other channels use ApplyDialog with custom content
      setApplyDialogOpen(true);
    }
  };

  const exportToPDF = useCallback(async () => {
    if (!contentRef.current || !jobInfo) return;
    
    setIsExporting(true);
    
    try {
      // Temporarily hide elements not needed in PDF
      const elementsToHide = document.querySelectorAll(
        "header, footer, [data-hide-in-pdf]"
      );
      elementsToHide.forEach((el) => {
        (el as HTMLElement).dataset.originalDisplay = (el as HTMLElement).style.display;
        (el as HTMLElement).style.display = "none";
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Restore hidden elements
      elementsToHide.forEach((el) => {
        (el as HTMLElement).style.display = (el as HTMLElement).dataset.originalDisplay || "";
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const margin = 10;
      const imgWidth = 210 - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297 - margin * 2;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `JD-${jobInfo.title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  }, [jobInfo]);

  const PrimaryIcon = getPrimaryChannelIcon();
  const primaryCTAText = getPrimaryChannelText();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedBackground />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
          <p className="text-muted-foreground text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <p className="text-destructive mb-4">Không tìm thấy vị trí tuyển dụng</p>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0 relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link to={departmentSlug ? `/${departmentSlug}` : "/"}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link to="/" className="hover:text-accent-purple transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </Link>
              {departmentSlug && job.departmentName && (
                <>
                  <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  <Link 
                    to={`/${departmentSlug}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                  >
                    {job.departmentName}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={exportToPDF}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xuất PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ThemeToggle />
            <Button 
              size="sm" 
              className="hidden sm:flex bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25" 
              onClick={handlePrimaryCTA}
            >
              <PrimaryIcon className="h-4 w-4 mr-2" />
              {primaryCTAText}
            </Button>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10 bg-background">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <TableOfContents items={tocItems} variant="desktop" />

          <article className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
            <TableOfContents items={tocItems} variant="mobile" />

            {/* Hero */}
            <header className="mb-6 sm:mb-10">
              <Badge className="mb-3 sm:mb-4 font-medium bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                TUYỂN DỤNG
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-heading-primary mb-4 sm:mb-6">
                {jobInfo.title} — {jobInfo.company}
              </h1>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Badge variant="outline" className="text-xs sm:text-sm py-1.5 px-3 bg-surface-elevated/50 backdrop-blur border-accent-purple/20 hover:border-accent-purple/40 transition-colors w-fit">
                  <strong className="text-accent-purple">Mức lương:</strong>&nbsp;{jobInfo.salary}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm py-1.5 px-3 bg-surface-elevated/50 backdrop-blur border-accent-blue/20 hover:border-accent-blue/40 transition-colors w-fit">
                  <strong className="text-accent-blue">Hình thức:</strong>&nbsp;{jobInfo.workType}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm py-1.5 px-3 bg-surface-elevated/50 backdrop-blur border-accent-cyan/20 hover:border-accent-cyan/40 transition-colors w-fit">
                  <strong className="text-accent-cyan">Báo cáo trực tiếp:</strong>&nbsp;{jobInfo.reportsTo}
                </Badge>
              </div>
            </header>

            {/* Sections */}
            {sections.map((section, index) => (
              <div key={section.id}>
                {index > 0 && <Separator className="my-5 sm:my-8" />}
                
                <section id={section.id} className="scroll-mt-20">
                  {section.isCollapsible ? (
                    <Accordion type="single" collapsible defaultValue={`${section.id}-content`}>
                      <AccordionItem value={`${section.id}-content`} className="border-none">
                        <AccordionTrigger className="text-lg sm:text-xl lg:text-2xl leading-tight font-semibold text-heading-primary hover:no-underline hover:text-accent-purple transition-colors p-0 text-left">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 sm:pt-4">
                          <div
                            className="text-sm sm:text-base leading-relaxed text-foreground content-display"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-heading-primary mb-3 sm:mb-4">{section.title}</h2>
                      <div
                        className="text-sm sm:text-base leading-relaxed text-foreground content-display"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </>
                  )}
                </section>
              </div>
            ))}

            <Separator className="my-5 sm:my-8" />

            {/* Section: Ứng tuyển */}
            <section id="ung-tuyen" className="scroll-mt-20">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Ứng tuyển</h2>
              <div className="text-sm sm:text-base leading-relaxed text-foreground space-y-3 sm:space-y-4">
                <p>
                  Gửi CV + 1 thứ chứng minh bạn làm được &quot;delivery&quot; (landing, content chuyển đổi,
                  campaign, deck/one-pager, case tự làm…).
                </p>

                <div className="space-y-2.5 sm:space-y-3 mt-4 sm:mt-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${jobInfo.email}`}
                      className="text-foreground hover:underline underline-offset-4 break-all text-sm sm:text-base"
                    >
                      {jobInfo.email}
                    </a>
                    <CopyButton text={jobInfo.email} label="Đã copy email" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground text-sm sm:text-base">{jobInfo.phone}</span>
                    <CopyButton text={jobInfo.phone} label="Đã copy số điện thoại" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a
                      href={jobInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline underline-offset-4 inline-flex items-center gap-1 text-sm sm:text-base"
                    >
                      linkedin.com/in/{linkedinUsername}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
                  {enabledChannels.map(([key, config], index) => {
                    const isPrimary = index === 0;
                    const baseClass = isPrimary
                      ? "bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25"
                      : "";
                    
                    if (key === "gmail") {
                      return (
                        <Button key={key} onClick={() => setApplyDialogOpen(true)} className={`${baseClass} w-full sm:w-auto`} variant={isPrimary ? "default" : "outline"}>
                          <Mail className="h-4 w-4 mr-2" />Email
                        </Button>
                      );
                    }
                    if (key === "zalo" && channels?.zalo.phone) {
                      return (
                        <Button key={key} asChild className="w-full sm:w-auto" variant={isPrimary ? "default" : "outline"}>
                          <a href={getZaloLink(channels.zalo.phone)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4 mr-2" />Zalo
                          </a>
                        </Button>
                      );
                    }
                    if (key === "facebook" && channels?.facebook.url) {
                      return (
                        <Button key={key} asChild className="w-full sm:w-auto" variant={isPrimary ? "default" : "outline"}>
                          <a href={channels.facebook.url} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4 mr-2" />Facebook
                          </a>
                        </Button>
                      );
                    }
                    if (key === "linkedin" && jobInfo?.linkedin) {
                      return (
                        <Button key={key} asChild className="w-full sm:w-auto" variant={isPrimary ? "default" : "outline"}>
                          <a href={jobInfo.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />LinkedIn
                          </a>
                        </Button>
                      );
                    }
                    if (key === "google_form") {
                      return (
                        <Button key={key} onClick={() => setFormDialogOpen(true)} className={`${baseClass} w-full sm:w-auto`} variant={isPrimary ? "default" : "outline"}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />Điền form
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 sm:py-8 mt-8 sm:mt-12 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="container px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </div>
            <span className="font-medium text-foreground text-sm sm:text-base">{jobInfo.company}</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Không bao giờ bỏ lỡ cuộc gọi
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              size="sm" 
              onClick={handlePrimaryCTA}
              className="bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25"
            >
              <PrimaryIcon className="h-4 w-4 mr-2" />
              {primaryCTAText}
            </Button>
          </div>
        </div>
      </footer>

      <MobileCTABar 
        onApplyClick={handlePrimaryCTA} 
        ctaText={primaryCTAText}
        ctaIcon={primaryChannel}
        linkedin={jobInfo?.linkedin}
      />
      <ApplyDialog 
        open={applyDialogOpen} 
        onOpenChange={setApplyDialogOpen} 
        email={jobInfo?.email} 
        jobTitle={jobInfo?.title}
        channelType={primaryChannel}
        popupContent={primaryPopupContent}
        actionUrl={getPrimaryActionUrl()}
      />
      {channels?.google_form.enabled && (
        <ApplyFormDialog open={formDialogOpen} onOpenChange={setFormDialogOpen} sheetUrl={channels.google_form.sheet_url} jobTitle={jobInfo?.title || ""} />
      )}
    </div>
  );
};

export default JobDetail;
