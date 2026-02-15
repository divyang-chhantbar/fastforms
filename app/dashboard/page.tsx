"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Form {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  _count: {
    responses: number;
  };
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("/api/getAllForms");
        setForms(response.data.forms);
        setIsLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Failed to fetch forms");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleDelete = async (formId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to responses page
    if (
      !window.confirm(
        "Are you sure you want to delete this form? This action cannot be undone.",
      )
    ) {
      return;
    }
    setDeletingFormId(formId);
    try {
      const response = await axios.delete(`/api/forms/${formId}`);
      if (response.data.success) {
        setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
      } else {
        alert(
          "Failed to delete form: " + (response.data.error || "Unknown error"),
        );
      }
    } catch (error) {
      alert("An error occurred while deleting the form.");
    } finally {
      setDeletingFormId(null);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">My Forms</h1>

      {forms.length === 0 ? (
        <p>No forms yet. Create one!</p>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              onClick={() => router.push(`/forms/${form.id}/responses`)}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{form.title}</h2>
              <p className="text-sm text-gray-600">
                {form._count.responses} responses • Created{" "}
                {new Date(form.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={(e) => handleDelete(form.id, e)}
                disabled={deletingFormId === form.id}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                {deletingFormId === form.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
