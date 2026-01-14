import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface JobInfo {
  title: string;
  company: string;
  salary: string;
  workType: string;
  reportsTo: string;
  email: string;
  phone: string;
  linkedin: string;
}

interface JobInfoEditorProps {
  info: JobInfo;
  onChange: (info: JobInfo) => void;
}

export function JobInfoEditor({ info, onChange }: JobInfoEditorProps) {
  const update = (field: keyof JobInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Thông tin chung</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Tiêu đề vị trí</Label>
          <Input
            value={info.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Assistant Product Marketing Manager"
          />
        </div>
        <div className="space-y-2">
          <Label>Công ty</Label>
          <Input
            value={info.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="BIVA Hotline AI"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Mức lương</Label>
          <Input
            value={info.salary}
            onChange={(e) => update("salary", e.target.value)}
            placeholder="Thương lượng"
          />
        </div>
        <div className="space-y-2">
          <Label>Hình thức</Label>
          <Input
            value={info.workType}
            onChange={(e) => update("workType", e.target.value)}
            placeholder="Full-time"
          />
        </div>
        <div className="space-y-2">
          <Label>Báo cáo trực tiếp</Label>
          <Input
            value={info.reportsTo}
            onChange={(e) => update("reportsTo", e.target.value)}
            placeholder="Product Marketing Lead"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={info.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Số điện thoại</Label>
          <Input
            value={info.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="0905495130"
          />
        </div>
        <div className="space-y-2">
          <Label>LinkedIn</Label>
          <Input
            value={info.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>
    </div>
  );
}
