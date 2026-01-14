import { Link, useParams } from "react-router-dom";
import { Loader2, Sparkles, Briefcase, ArrowRight, ArrowLeft, MapPin, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useDepartments } from "@/hooks/useDepartments";
import { useJobPostings } from "@/hooks/useJobPostings";

const DepartmentJobs = () => {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const { departments, loading: deptLoading } = useDepartments();
  const { jobPostings, loading: jobsLoading } = useJobPostings({ departmentSlug });

  const loading = deptLoading || jobsLoading;
  const department = departments.find((d) => d.slug === departmentSlug);

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

  if (!department) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <p className="text-destructive mb-4">Không tìm thấy phòng ban</p>
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <Link to="/" className="font-semibold text-foreground text-sm sm:text-base hover:opacity-80">
                BIVA
              </Link>
              <span className="text-muted-foreground hidden sm:inline">/ {department.name}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero - Compact */}
        <div className="mb-6 sm:mb-10 max-w-3xl">
          <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0">
            <Briefcase className="w-3 h-3 mr-1" />
            {jobPostings.length} VỊ TRÍ
          </Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading-primary mb-2 sm:mb-3">
            {department.name}
          </h1>
          {department.description && (
            <p className="text-muted-foreground text-sm sm:text-lg">{department.description}</p>
          )}
        </div>

        {/* Jobs list */}
        {jobPostings.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-surface-elevated/50 backdrop-blur border border-border/50">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">Chưa có vị trí tuyển dụng trong phòng ban này</p>
            <Button asChild variant="outline">
              <Link to="/">Xem tất cả vị trí</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {jobPostings.map((job) => (
              <Link
                key={job.id}
                to={`/${departmentSlug}/${job.slug}`}
                className="group block"
              >
                <div className="p-4 sm:p-5 rounded-xl bg-surface-elevated/50 backdrop-blur border border-border/50 hover:border-accent-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent-purple/5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Job Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-heading-primary group-hover:text-accent-purple transition-colors line-clamp-1">
                        {job.jobInfo.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{job.jobInfo.company}</p>
                      
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                        {job.jobInfo.salary && (
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                            <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate max-w-[100px] sm:max-w-none">{job.jobInfo.salary}</span>
                          </div>
                        )}
                        {job.jobInfo.workType && (
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate max-w-[80px] sm:max-w-none">{job.jobInfo.workType}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Mobile Action */}
                      <div className="flex items-center gap-1 mt-3 sm:hidden text-accent-purple text-xs font-medium">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                    
                    {/* Desktop Action */}
                    <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 hidden sm:block group-hover:text-accent-purple group-hover:translate-x-1 transition-all mt-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Xem tất cả phòng ban
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium text-foreground">BIVA</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Không bao giờ bỏ lỡ cuộc gọi
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DepartmentJobs;
