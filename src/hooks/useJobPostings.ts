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

export interface ChannelPopupContent {
  title: string;
  description: string;
  checklistItems: { title: string; description: string }[];
  buttonText: string;
}

export interface ChannelConfig {
  gmail: { enabled: boolean; priority: number; popupContent?: ChannelPopupContent };
  zalo: { enabled: boolean; phone: string; priority: number; popupContent?: ChannelPopupContent };
  facebook: { enabled: boolean; url: string; priority: number; popupContent?: ChannelPopupContent };
  linkedin: { enabled: boolean; priority: number; popupContent?: ChannelPopupContent };
  google_form: { enabled: boolean; sheet_url: string; priority: number; popupContent?: ChannelPopupContent };
  primaryChannel?: string;
}

export const DEFAULT_CHANNELS: ChannelConfig = {
  gmail: { enabled: true, priority: 1 },
  zalo: { enabled: false, phone: "", priority: 2 },
  facebook: { enabled: false, url: "", priority: 3 },
  linkedin: { enabled: false, priority: 4 },
  google_form: { enabled: false, sheet_url: "", priority: 5 },
  primaryChannel: "gmail",
};

export interface JobPosting {
  id: string;
  slug: string;
  departmentId: string | null;
  departmentSlug?: string;
  departmentName?: string;
  jobInfo: JobInfo;
  sections: Section[];
  channels: ChannelConfig;
  isActive: boolean;
}

export function useJobPostings(options?: { departmentSlug?: string; jobSlug?: string }) {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobPostings();
  }, [options?.departmentSlug, options?.jobSlug]);

  async function fetchJobPostings() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("job_postings")
        .select(`
          *,
          departments (
            id,
            name,
            slug
          )
        `)
        .eq("is_active", true);

      if (options?.jobSlug) {
        query = query.eq("slug", options.jobSlug);
      }

      const { data, error: fetchError } = await query.order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      let filtered = data || [];

      // Filter by department slug if provided
      if (options?.departmentSlug) {
        filtered = filtered.filter(
          (job: any) => job.departments?.slug === options.departmentSlug
        );
      }

      const mapped: JobPosting[] = filtered.map((job: any) => {
        // Parse channels from DB or use defaults
        const rawChannels = job.channels || {};
        const channels: ChannelConfig = {
          gmail: { 
            enabled: rawChannels.gmail?.enabled ?? true, 
            priority: rawChannels.gmail?.priority ?? 1,
            popupContent: rawChannels.gmail?.popupContent,
          },
          zalo: { 
            enabled: rawChannels.zalo?.enabled ?? false, 
            phone: rawChannels.zalo?.phone ?? "", 
            priority: rawChannels.zalo?.priority ?? 2,
            popupContent: rawChannels.zalo?.popupContent,
          },
          facebook: { 
            enabled: rawChannels.facebook?.enabled ?? false, 
            url: rawChannels.facebook?.url ?? "", 
            priority: rawChannels.facebook?.priority ?? 3,
            popupContent: rawChannels.facebook?.popupContent,
          },
          linkedin: { 
            enabled: rawChannels.linkedin?.enabled ?? false, 
            priority: rawChannels.linkedin?.priority ?? 4,
            popupContent: rawChannels.linkedin?.popupContent,
          },
          google_form: { 
            enabled: rawChannels.google_form?.enabled ?? false, 
            sheet_url: rawChannels.google_form?.sheet_url ?? "", 
            priority: rawChannels.google_form?.priority ?? 5,
            popupContent: rawChannels.google_form?.popupContent,
          },
          primaryChannel: rawChannels.primaryChannel ?? "gmail",
        };

        return {
          id: job.id,
          slug: job.slug,
          departmentId: job.department_id,
          departmentSlug: job.departments?.slug || null,
          departmentName: job.departments?.name || null,
          jobInfo: {
            title: job.title,
            company: job.company,
            salary: job.salary || "",
            workType: job.work_type || "",
            reportsTo: job.reports_to || "",
            email: job.email || "",
            phone: job.phone || "",
            linkedin: job.linkedin || "",
          },
          sections: Array.isArray(job.sections)
            ? job.sections.map((s: any) => ({
                id: s.id || "",
                title: s.title || "",
                content: s.content || "",
                isCollapsible: s.isCollapsible || false,
              }))
            : [],
          channels,
          isActive: job.is_active,
        };
      });

      setJobPostings(mapped);
    } catch (err) {
      console.error("Error fetching job postings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch job postings");
    } finally {
      setLoading(false);
    }
  }

  async function saveJobPosting(
    jobInfo: JobInfo,
    sections: Section[],
    departmentId: string | null,
    slug: string,
    existingId?: string,
    channels?: ChannelConfig
  ) {
    try {
      const sectionsJson = sections.map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        isCollapsible: s.isCollapsible,
      }));

      const dbData: any = {
        title: jobInfo.title,
        company: jobInfo.company,
        salary: jobInfo.salary,
        work_type: jobInfo.workType,
        reports_to: jobInfo.reportsTo,
        email: jobInfo.email,
        phone: jobInfo.phone,
        linkedin: jobInfo.linkedin,
        sections: sectionsJson,
        department_id: departmentId,
        slug,
      };

      if (channels) {
        dbData.channels = channels;
      }

      if (existingId) {
        const { error: updateError } = await supabase
          .from("job_postings")
          .update(dbData)
          .eq("id", existingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("job_postings")
          .insert([dbData]);

        if (insertError) throw insertError;
      }

      await fetchJobPostings();
      return { success: true };
    } catch (err) {
      console.error("Error saving job posting:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to save",
      };
    }
  }

  async function deleteJobPosting(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchJobPostings();
      return { success: true };
    } catch (err) {
      console.error("Error deleting job posting:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete",
      };
    }
  }

  return {
    jobPostings,
    loading,
    error,
    saveJobPosting,
    deleteJobPosting,
    refetch: fetchJobPostings,
  };
}
