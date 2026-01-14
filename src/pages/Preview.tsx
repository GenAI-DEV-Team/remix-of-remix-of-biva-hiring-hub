import { useState } from "react";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Mail, Phone, Linkedin, ExternalLink } from "lucide-react";
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
import { useJobPosting } from "@/hooks/useJobPosting";

export default function Preview() {
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Không thể tải dữ liệu</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-semibold text-foreground hover:opacity-80">
            {jobInfo.company}
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/">
                Trang chủ
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/editor">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button size="sm" className="hidden sm:flex" onClick={() => setApplyDialogOpen(true)}>
              Ứng tuyển ngay
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Desktop Table of Contents - Sidebar */}
          <TableOfContents items={tocItems} variant="desktop" />

          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
            {/* Mobile Table of Contents - Inside article */}
            <TableOfContents items={tocItems} variant="mobile" />

            {/* Hero */}
            <header className="mb-6 sm:mb-10">
              <Badge variant="secondary" className="mb-3 sm:mb-4 font-medium text-xs sm:text-sm">
                TUYỂN DỤNG
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-4 sm:mb-6">
                {jobInfo.title} — {jobInfo.company}
              </h1>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Badge variant="outline" className="text-xs sm:text-sm py-1.5 px-3 w-fit">
                  <strong>Mức lương:</strong>&nbsp;{jobInfo.salary}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm py-1.5 px-3 w-fit">
                  <strong>Hình thức:</strong>&nbsp;{jobInfo.workType}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm py-1.5 px-3 w-fit">
                  <strong>Báo cáo trực tiếp:</strong>&nbsp;{jobInfo.reportsTo}
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
                        <AccordionTrigger className="text-lg sm:text-xl lg:text-2xl leading-tight font-semibold text-foreground hover:no-underline hover:opacity-70 transition-opacity p-0 text-left">
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
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-3 sm:mb-4">{section.title}</h2>
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
                      className="text-foreground hover:underline underline-offset-4 text-sm sm:text-base"
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
                  <Button onClick={() => setApplyDialogOpen(true)} className="w-full sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" />
                    Ứng tuyển ngay
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a
                      href={jobInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
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
      <footer className="border-t border-border py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="container text-center space-y-3 sm:space-y-4">
          <p className="text-muted-foreground text-xs sm:text-sm">
            {jobInfo.company} — Không bao giờ bỏ lỡ cuộc gọi
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="sm" onClick={() => setApplyDialogOpen(true)}>
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
}