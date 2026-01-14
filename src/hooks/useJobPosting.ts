import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export interface Section {
  id: string;
  title: string;
  content: string;
  isCollapsible: boolean;
}

export interface JobPosting {
  id: string;
  slug: string;
  jobInfo: JobInfo;
  sections: Section[];
  isActive: boolean;
}

const DEFAULT_JOB_INFO: JobInfo = {
  title: "Assistant Product Marketing Manager - Đà Nẵng",
  company: "BIVA",
  salary: "Thương lượng",
  workType: "Full-time (Onsite)",
  reportsTo: "Product Marketing Manager",
  email: "nhuquan0310.work@gmail.com",
  phone: "0905495130",
  linkedin: "https://www.linkedin.com/in/nhuquan0310/",
};

const DEFAULT_SECTIONS: Section[] = [];

export function useJobPosting(slug?: string) {
  const [jobInfo, setJobInfo] = useState<JobInfo>(DEFAULT_JOB_INFO);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobPostingId, setJobPostingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobPosting() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("job_postings")
          .select("*")
          .eq("is_active", true);

        if (slug) {
          query = query.eq("slug", slug);
        }

        const { data, error: fetchError } = await query.limit(1).maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setJobPostingId(data.id);
          setJobInfo({
            title: data.title,
            company: data.company,
            salary: data.salary || "",
            workType: data.work_type || "",
            reportsTo: data.reports_to || "",
            email: data.email || "",
            phone: data.phone || "",
            linkedin: data.linkedin || "",
          });

          // Parse sections from JSONB
          const parsedSections = Array.isArray(data.sections)
            ? data.sections.map((s: any) => ({
                id: s.id || "",
                title: s.title || "",
                content: s.content || "",
                isCollapsible: s.isCollapsible || false,
              }))
            : [];
          setSections(parsedSections);
        }
      } catch (err) {
        console.error("Error fetching job posting:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch job posting");
      } finally {
        setLoading(false);
      }
    }

    fetchJobPosting();
  }, [slug]);

  const saveJobPosting = async (newJobInfo: JobInfo, newSections: Section[]) => {
    try {
      // Convert sections to JSON-compatible format
      const sectionsJson = newSections.map(s => ({
        id: s.id,
        title: s.title,
        content: s.content,
        isCollapsible: s.isCollapsible,
      }));

      if (jobPostingId) {
        // Update existing
        const { error: updateError } = await supabase
          .from("job_postings")
          .update({
            title: newJobInfo.title,
            company: newJobInfo.company,
            salary: newJobInfo.salary,
            work_type: newJobInfo.workType,
            reports_to: newJobInfo.reportsTo,
            email: newJobInfo.email,
            phone: newJobInfo.phone,
            linkedin: newJobInfo.linkedin,
            sections: sectionsJson,
          })
          .eq("id", jobPostingId);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { data, error: insertError } = await supabase
          .from("job_postings")
          .insert([{
            title: newJobInfo.title,
            company: newJobInfo.company,
            salary: newJobInfo.salary,
            work_type: newJobInfo.workType,
            reports_to: newJobInfo.reportsTo,
            email: newJobInfo.email,
            phone: newJobInfo.phone,
            linkedin: newJobInfo.linkedin,
            sections: sectionsJson,
            slug: `job-${Date.now()}`,
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) setJobPostingId(data.id);
      }

      setJobInfo(newJobInfo);
      setSections(newSections);
      return { success: true };
    } catch (err) {
      console.error("Error saving job posting:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Failed to save" 
      };
    }
  };

  return {
    jobInfo,
    sections,
    loading,
    error,
    setJobInfo,
    setSections,
    saveJobPosting,
    jobPostingId,
  };
}
