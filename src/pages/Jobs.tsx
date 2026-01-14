import { Link } from "react-router-dom";
import { Loader2, Sparkles, Briefcase, ArrowRight, Users, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useDepartments } from "@/hooks/useDepartments";
import { useJobPostings } from "@/hooks/useJobPostings";

const Jobs = () => {
  const { departments, loading: deptLoading } = useDepartments();
  const { jobPostings, loading: jobsLoading } = useJobPostings();

  const loading = deptLoading || jobsLoading;

  // Group jobs by department
  const jobsByDepartment = departments.map((dept) => ({
    department: dept,
    jobs: jobPostings.filter((job) => job.departmentSlug === dept.slug),
  }));

  const totalJobs = jobPostings.length;

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm sm:text-base">BIVA</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Section - More compact */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 font-medium bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0">
            <Briefcase className="w-3 h-3 mr-1" />
            {totalJobs} VỊ TRÍ ĐANG TUYỂN
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-heading-primary mb-4">
            Cơ hội nghề nghiệp tại{" "}
            <span className="bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
              BIVA
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Tham gia đội ngũ xây dựng Hotline AI hàng đầu Việt Nam
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12 max-w-2xl mx-auto">
          <div className="text-center p-2 sm:p-4 rounded-xl bg-surface-elevated/50 backdrop-blur border border-border/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-purple/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-accent-purple" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-heading-primary">{totalJobs}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Vị trí</div>
          </div>
          <div className="text-center p-2 sm:p-4 rounded-xl bg-surface-elevated/50 backdrop-blur border border-border/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-blue/10 flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-heading-primary">{departments.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Phòng ban</div>
          </div>
          <div className="text-center p-2 sm:p-4 rounded-xl bg-surface-elevated/50 backdrop-blur border border-border/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-heading-primary">10+</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Thành viên</div>
          </div>
        </div>

        {/* Department Cards Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {jobsByDepartment.map(({ department, jobs }) => (
            <Link
              key={department.id}
              to={`/${department.slug}`}
              className="group block"
            >
              <div className="h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-surface-elevated/50 backdrop-blur border border-border/50 hover:border-accent-purple/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent-purple/5">
                {/* Department Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base sm:text-xl font-semibold text-heading-primary group-hover:text-accent-purple transition-colors truncate">
                        {department.name}
                      </h2>
                      <Badge variant="secondary" className="shrink-0 text-[10px] sm:text-xs bg-accent-purple/10 text-accent-purple border-0">
                        {jobs.length}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {department.description || "Phòng ban"}
                    </p>
                  </div>
                </div>

                {/* Job List Preview */}
                {jobs.length > 0 ? (
                  <div className="space-y-2">
                    {jobs.slice(0, 2).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-background/50 border border-border/30"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs sm:text-sm text-foreground truncate">
                            {job.jobInfo.title}
                          </div>
                          {job.jobInfo.salary && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                              {job.jobInfo.salary}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0 ml-2" />
                      </div>
                    ))}
                    {jobs.length > 2 && (
                      <div className="text-center pt-1">
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          +{jobs.length - 2} vị trí khác
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 sm:py-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">Chưa có vị trí</p>
                  </div>
                )}

                {/* View All Button */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-accent-purple font-medium">
                      Xem tất cả
                    </span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-accent-purple group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Jobs Section */}
        {jobPostings.length > 0 && (
          <div className="mt-10 sm:mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-xl font-semibold text-heading-primary">
                Tất cả vị trí
              </h2>
              <Badge variant="outline" className="text-[10px] sm:text-xs">{totalJobs} vị trí</Badge>
            </div>
            
            <div className="grid gap-2 sm:gap-3">
              {jobPostings.map((job) => {
                const dept = departments.find(d => d.id === job.departmentId);
                return (
                  <Link
                    key={job.id}
                    to={`/${job.departmentSlug || 'job'}/${job.slug}`}
                    className="group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-surface-elevated/50 backdrop-blur border border-border/50 hover:border-accent-purple/40 transition-all">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-accent-purple" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm sm:text-base text-foreground group-hover:text-accent-purple transition-colors truncate">
                            {job.jobInfo.title}
                          </span>
                          {dept && (
                            <Badge variant="outline" className="text-[10px] shrink-0 hidden sm:inline-flex">
                              {dept.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1 overflow-hidden">
                          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{job.jobInfo.company}</span>
                          {job.jobInfo.salary && (
                            <>
                              <span className="text-muted-foreground/50 shrink-0">•</span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{job.jobInfo.salary}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-accent-purple group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
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

export default Jobs;
