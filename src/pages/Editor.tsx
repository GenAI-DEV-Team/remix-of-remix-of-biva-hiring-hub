import { useState, useEffect } from "react";
import { Eye, Download, ArrowLeft, Loader2, Rocket, ExternalLink } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { JobInfoEditor } from "@/components/editor/JobInfoEditor";
import { SectionEditor } from "@/components/editor/SectionEditor";
import { ChannelConfigEditor, ChannelConfig, DEFAULT_CHANNELS } from "@/components/editor/ChannelConfigEditor";
import { PublishDialog } from "@/components/editor/PublishDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LightModeWrapper } from "@/components/LightModeWrapper";
import { useDepartments } from "@/hooks/useDepartments";
import { useJobPostings, JobInfo, Section } from "@/hooks/useJobPostings";

const DEFAULT_JOB_INFO: JobInfo = {
  title: "",
  company: "BIVA",
  salary: "Thương lượng",
  workType: "Full-time (Onsite)",
  reportsTo: "",
  email: "",
  phone: "",
  linkedin: "",
};

export default function Editor() {
  const { jobId } = useParams<{ jobId: string }>();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { departments, loading: deptLoading } = useDepartments();
  const { jobPostings, loading: jobsLoading, saveJobPosting } = useJobPostings();

  const [jobInfo, setJobInfo] = useState<JobInfo>(DEFAULT_JOB_INFO);
  const [sections, setSections] = useState<Section[]>([]);
  const [channels, setChannels] = useState<ChannelConfig>(DEFAULT_CHANNELS);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const existingJob = jobId ? jobPostings.find((j) => j.id === jobId) : null;
  const isNewJob = !jobId || jobId === "new";

  // Load existing job data
  useEffect(() => {
    if (existingJob) {
      setJobInfo(existingJob.jobInfo);
      setSections(existingJob.sections);
      setChannels(existingJob.channels);
      setDepartmentId(existingJob.departmentId);
      setSlug(existingJob.slug);
    }
  }, [existingJob]);

  // Auto-generate slug from title for new jobs
  useEffect(() => {
    if (isNewJob && jobInfo.title) {
      const generatedSlug = jobInfo.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [jobInfo.title, isNewJob]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (authLoading || deptLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const handlePublish = async () => {
    if (!jobInfo.title || !slug) {
      toast({ variant: "destructive", description: "Vui lòng nhập tiêu đề và slug" });
      setPublishDialogOpen(false);
      return;
    }

    setIsSaving(true);
    const result = await saveJobPosting(
      jobInfo,
      sections,
      departmentId,
      slug,
      isNewJob ? undefined : jobId,
      channels
    );
    setIsSaving(false);

    if (result.success) {
      toast({ description: isNewJob ? "Đã publish vị trí mới!" : "Đã cập nhật thành công!" });
      setPublishSuccess(true);
    } else {
      toast({ variant: "destructive", description: result.error });
    }
  };

  const handleClosePublishDialog = (open: boolean) => {
    if (!open) {
      setPublishSuccess(false);
    }
    setPublishDialogOpen(open);
  };

  const handleExport = () => {
    const data = { jobInfo, sections, channels, departmentId, slug };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-posting-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ description: "Đã export file JSON!" });
  };

  const previewUrl = departmentId 
    ? `/${departments.find(d => d.id === departmentId)?.slug}/${slug}`
    : `/job/${slug}`;

  return (
    <LightModeWrapper>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Link to="/cms">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <span className="font-semibold text-foreground truncate">
                {isNewJob ? "Thêm vị trí mới" : "Chỉnh sửa vị trí"}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {!isNewJob && (
                <Button variant="outline" size="sm" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                    <ExternalLink className="h-3 w-3 ml-1.5" />
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => setPublishDialogOpen(true)}
                className="bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 border-0 text-white"
              >
                <Rocket className="h-4 w-4 mr-2" />
                {isNewJob ? "Publish" : "Cập nhật"}
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              {!isNewJob && (
                <Button variant="outline" size="sm" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button size="sm" onClick={() => setPublishDialogOpen(true)} className="bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0">
                <Rocket className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Department & Slug */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="space-y-2">
            <Label>Phòng ban</Label>
            <Select value={departmentId || "none"} onValueChange={(v) => setDepartmentId(v === "none" ? null : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Không chọn --</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Slug (URL)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="vi-tri-tuyen-dung" />
            <p className="text-xs text-muted-foreground">URL: {previewUrl}</p>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="sections">Nội dung</TabsTrigger>
            <TabsTrigger value="channels">Kênh CTA</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <JobInfoEditor info={jobInfo} onChange={setJobInfo} />
          </TabsContent>

          <TabsContent value="sections">
            <SectionEditor sections={sections} onChange={setSections} />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelConfigEditor 
              channels={channels} 
              onChange={setChannels}
              email={jobInfo.email}
              linkedin={jobInfo.linkedin}
            />
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <div className="flex justify-center gap-3">
          {!isNewJob && (
            <Button variant="outline" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Xem trang
                <ExternalLink className="h-3 w-3 ml-1.5" />
              </a>
            </Button>
          )}
          <Button onClick={() => setPublishDialogOpen(true)} className="bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0">
            <Rocket className="h-4 w-4 mr-2" />
            {isNewJob ? "Publish" : "Cập nhật"}
          </Button>
        </div>
      </main>

      <PublishDialog
        open={publishDialogOpen}
        onOpenChange={handleClosePublishDialog}
        previewUrl={previewUrl}
        isNewJob={isNewJob}
        isSaving={isSaving}
        isSuccess={publishSuccess}
        onPublish={handlePublish}
      />
    </LightModeWrapper>
  );
}
