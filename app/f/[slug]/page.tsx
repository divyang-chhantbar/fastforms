"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormData {
  id: string;
  userId: string;
  title: string;
  fields: Field[];
  createdAt: string;
  slug: string;
  isPublished: boolean;
}

function renderField(field: Field, value: any, onChange: (fieldId: string, value: any) => void) {
  switch (field.type) {
    case "text":
    case "email":
      return (
        <input
          type={field.type}
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      );

    case "textarea":
      return (
        <textarea
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-full border rounded px-3 py-2 min-h-[100px]"
        />
      );

    case "select":
      return (
        <select
          name={field.id}
          required={field.required}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="" className="text-gray-700">Select an option</option>
          {field.options?.map((option: string) => (
            <option key={option} value={option} className="text-gray-700">
              {option}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((option: string) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={option}
                required={field.required}
                checked={value === option}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          {field.options?.map((option: string) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option}
                checked={value?.includes(option) || false}
                onChange={(e) => {
                  const currentValues = value || [];
                  const newValues = e.target.checked
                    ? [...currentValues, option]
                    : currentValues.filter((v: string) => v !== option);
                  onChange(field.id, newValues);
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    default:
      return <div>Unsupported field type</div>;
  }
}

export default function PublicFormPage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/forms/${slug}`);
        const { data } = response.data;
        setFormData(data);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, [slug]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/forms/submit", {
        formId: formData?.id,
        data: formValues,
      });

      setSubmitSuccess(true);
      setFormValues({});
    } catch (error: any) {
      console.error("Form submission failed:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading form...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!formData) {
    return <div className="p-8">Form not found</div>;
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen p-8 max-w-xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
          <p className="text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.fields.map((field: Field) => (
          <div key={field.id}>
            <label className="block mb-2 font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {renderField(field, formValues[field.id], handleFieldChange)}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}