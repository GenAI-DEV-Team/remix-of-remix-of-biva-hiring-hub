import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Building2, 
  Briefcase, 
  Loader2, 
  LogOut, 
  Pencil, 
  Trash2,
  ArrowLeft,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LightModeWrapper } from "@/components/LightModeWrapper";
import { useDepartments, Department } from "@/hooks/useDepartments";
import { useJobPostings, JobPosting } from "@/hooks/useJobPostings";
import { DepartmentFormDialog } from "@/components/cms/DepartmentFormDialog";
import { JobUrlDisplay } from "@/components/cms/JobUrlDisplay";

export default function CMSDashboard() {
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { departments, loading: deptLoading, saveDepartment, deleteDepartment } = useDepartments();
  const { jobPostings, loading: jobsLoading, deleteJobPosting } = useJobPostings();

  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDept(dept);
    setDeptDialogOpen(true);
  };

  const handleDeleteDepartment = async (id: string) => {
    const result = await deleteDepartment(id);
    if (result.success) {
      toast({ description: "Đã xóa phòng ban!" });
    } else {
      toast({ variant: "destructive", description: result.error });
    }
  };

  const handleDeleteJob = async (id: string) => {
    const result = await deleteJobPosting(id);
    if (result.success) {
      toast({ description: "Đã xóa vị trí!" });
    } else {
      toast({ variant: "destructive", description: result.error });
    }
  };

  const handleSaveDepartment = async (data: Omit<Department, "id"> & { id?: string }) => {
    const result = await saveDepartment(data);
    if (result.success) {
      toast({ description: data.id ? "Đã cập nhật phòng ban!" : "Đã tạo phòng ban!" });
      setDeptDialogOpen(false);
      setEditingDept(null);
    } else {
      toast({ variant: "destructive", description: result.error });
    }
    return result;
  };

  if (authLoading || deptLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <LightModeWrapper>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Link to="/">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 min-w-0">
                <Link to="/" className="font-semibold text-foreground hover:opacity-80 truncate">
                  BIVA
                </Link>
                <span className="text-muted-foreground hidden sm:inline">/ CMS</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground truncate max-w-[150px] hidden md:block">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Quản lý Tuyển dụng</h1>
          <p className="text-muted-foreground">Quản lý phòng ban và vị trí tuyển dụng</p>
        </div>

        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Phòng ban
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Vị trí tuyển dụng
            </TabsTrigger>
          </TabsList>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Danh sách phòng ban</h2>
              <Button 
                onClick={() => {
                  setEditingDept(null);
                  setDeptDialogOpen(true);
                }}
                className="bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm phòng ban
              </Button>
            </div>

            {departments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Chưa có phòng ban nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {departments.map((dept) => (
                  <Card key={dept.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <CardDescription>/{dept.slug}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditDepartment(dept)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa phòng ban?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Hành động này không thể hoàn tác. Các vị trí thuộc phòng ban này sẽ không bị xóa nhưng sẽ không còn thuộc phòng ban nào.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dept.description && (
                        <p className="text-sm text-muted-foreground">{dept.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline">
                          {jobPostings.filter(j => j.departmentId === dept.id).length} vị trí
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Danh sách vị trí</h2>
              <Button 
                asChild
                className="bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0"
              >
                <Link to="/editor/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm vị trí
                </Link>
              </Button>
            </div>

            {jobPostings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Chưa có vị trí nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {jobPostings.map((job) => {
                  const jobUrl = job.departmentSlug 
                    ? `/${job.departmentSlug}/${job.slug}`
                    : `/job/${job.slug}`;
                  
                  return (
                    <Card key={job.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg">{job.jobInfo.title}</CardTitle>
                            <CardDescription>
                              {job.departmentName || "Chưa phân loại"}
                            </CardDescription>
                            <JobUrlDisplay url={jobUrl} />
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              asChild
                            >
                              <a href={jobUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              asChild
                            >
                              <Link to={`/editor/${job.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xóa vị trí?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{job.jobInfo.company}</Badge>
                          {job.jobInfo.workType && (
                            <Badge variant="outline">{job.jobInfo.workType}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <DepartmentFormDialog
        open={deptDialogOpen}
        onOpenChange={(open) => {
          setDeptDialogOpen(open);
          if (!open) setEditingDept(null);
        }}
        department={editingDept}
        onSave={handleSaveDepartment}
      />
    </LightModeWrapper>
  );
}
