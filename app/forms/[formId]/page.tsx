"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
  options: string[];
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

function renderField(field: Field) {
  switch (field.type) {
    case "text":
    case "email":
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          className="w-full border rounded px-3 py-2"
        />
      );

    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          className="w-full border rounded px-3 py-2 min-h-100"
        />
      );

    case "select":
      return (
        <select
          required={field.required}
          className="w-full border rounded px-3 py-2"
        >
          <option value="" className="text-gray-700">
            Select an option
          </option>
          {field.options.map((option: string) => (
            <option key={option} value={option} className="text-gray-700">
              {option}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {field.options.map((option: string) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={option}
                required={field.required}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          {field.options.map((option: string) => (
            <label key={option} className="flex items-center gap-2">
              <input type="checkbox" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    default:
      return <div>Unsupported field type</div>;
  }
}

export default function FormGenerationPage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const params = useParams();
  const formId = params.formId as string;
  // we have done this because useParams returns a string or undefined, and we want to ensure that formId is treated as a string for our API call.

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/forms/${formId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { data } = response.data;
        setFormData(data);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchFormData().finally(() => setIsLoading(false));
  }, [formId]);
  const handleCopyLink = async () => {
    try {
      const formLinkToBeCopied = `http://localhost:3000/f/${formData?.slug}`;
      await navigator.clipboard.writeText(formLinkToBeCopied);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link: ", error);
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

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>

      <form className="space-y-6">
        {formData.fields.map((field: any) => (
          <div key={field.id}>
            <label className="block mb-2 font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {renderField(field)}
          </div>
        ))}

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Share this form:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`http://localhost:3000/f/${formData.slug}`}
              readOnly
              className="flex-1 px-3 py-2 border rounded bg-white"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {isCopied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
