import { useState } from "react";
import { Mail, Phone, Linkedin, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableOfContents } from "@/components/TableOfContents";
import { MobileCTABar } from "@/components/MobileCTABar";
import { CopyButton } from "@/components/CopyButton";
import { ApplyDialog } from "@/components/ApplyDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useJobPosting } from "@/hooks/useJobPosting";

const Index = () => {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const { jobInfo, sections, loading, error } = useJobPosting();

  const tocItems = sections.map((s) => ({
    id: s.id,
    title: s.title,
    level: 2,
  }));

  // Add "Ứng tuyển" section to ToC
  tocItems.push({ id: "ung-tuyen", title: "Ứng tuyển", level: 2 });

  const linkedinUsername = jobInfo.linkedin
    .replace("https://www.linkedin.com/in/", "")
    .replace("https://linkedin.com/in/", "")
    .replace("/", "");

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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <p className="text-destructive mb-2">Không thể tải dữ liệu</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm sm:text-base">{jobInfo.company}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button 
              size="sm" 
              className="hidden sm:flex bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25" 
              onClick={() => setApplyDialogOpen(true)}
            >
              Ứng tuyển ngay
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Desktop Table of Contents - Sidebar */}
          <TableOfContents items={tocItems} variant="desktop" />

          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
            {/* Mobile Table of Contents - Inside article */}
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
                  <Button 
                    onClick={() => setApplyDialogOpen(true)}
                    className="bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25 w-full sm:w-auto"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Ứng tuyển ngay
                  </Button>
                  <Button asChild variant="outline" className="border-accent-blue/30 hover:border-accent-blue/50 hover:bg-accent-blue/10 w-full sm:w-auto">
                    <a
                      href={jobInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-2 text-accent-blue" />
                      LinkedIn
                    </a>
                  </Button>
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
              onClick={() => setApplyDialogOpen(true)}
              className="bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity border-0 text-white shadow-lg shadow-accent-purple/25"
            >
              Ứng tuyển ngay
            </Button>
          </div>
        </div>
      </footer>

      {/* Mobile CTA Bar */}
      <MobileCTABar onApplyClick={() => setApplyDialogOpen(true)} />

      {/* Apply Dialog */}
      <ApplyDialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen} />
    </div>
  );
};

export default Index;