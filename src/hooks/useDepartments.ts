import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("departments")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (fetchError) throw fetchError;

      const mapped = (data || []).map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        isActive: d.is_active,
        displayOrder: d.display_order,
      }));

      setDepartments(mapped);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  }

  async function saveDepartment(department: Omit<Department, "id"> & { id?: string }) {
    try {
      const dbData = {
        name: department.name,
        slug: department.slug,
        description: department.description,
        is_active: department.isActive,
        display_order: department.displayOrder,
      };

      if (department.id) {
        const { error: updateError } = await supabase
          .from("departments")
          .update(dbData)
          .eq("id", department.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("departments")
          .insert([dbData]);

        if (insertError) throw insertError;
      }

      await fetchDepartments();
      return { success: true };
    } catch (err) {
      console.error("Error saving department:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to save",
      };
    }
  }

  async function deleteDepartment(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchDepartments();
      return { success: true };
    } catch (err) {
      console.error("Error deleting department:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete",
      };
    }
  }

  return {
    departments,
    loading,
    error,
    saveDepartment,
    deleteDepartment,
    refetch: fetchDepartments,
  };
}
