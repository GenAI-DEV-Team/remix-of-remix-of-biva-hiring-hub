import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Department } from "@/hooks/useDepartments";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSave: (data: Omit<Department, "id"> & { id?: string }) => Promise<{ success: boolean; error?: string }>;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSave,
}: DepartmentFormDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setSlug(department.slug);
      setDescription(department.description || "");
      setDisplayOrder(department.displayOrder);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setDisplayOrder(0);
    }
  }, [department, open]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!department && name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [name, department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await onSave({
      id: department?.id,
      name,
      slug,
      description: description || null,
      isActive: true,
      displayOrder,
    });

    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Sửa phòng ban" : "Thêm phòng ban"}
          </DialogTitle>
          <DialogDescription>
            {department 
              ? "Cập nhật thông tin phòng ban"
              : "Tạo phòng ban mới để phân loại vị trí tuyển dụng"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên phòng ban</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Marketing, Engineering, Sales..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="marketing"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL sẽ là: /{slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về phòng ban..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Thứ tự hiển thị</Label>
            <Input
              id="order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-gradient-to-r from-accent-purple to-accent-blue text-white border-0"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {department ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
