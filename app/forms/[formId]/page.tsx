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
          disabled
          className="w-full border rounded px-3 py-2"
        />
      );

    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className="w-full border rounded px-3 py-2 min-h-100"
        />
      );

    case "select":
      return (
        <select
          required={field.required}
          disabled
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
                disabled
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
              <input type="checkbox" value={option} disabled />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    case "number":
      return (
        <input
          type="number"
          name={field.id}
          placeholder={field.placeholder}
          required={field.required}
          disabled
          className="w-full border rounded px-3 py-2"
        />
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
  const [isToggling, setIsToggling] = useState(false);

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
      const formLinkToBeCopied = `${window.location.origin}/f/${formData?.slug}`;
      await navigator.clipboard.writeText(formLinkToBeCopied);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link: ", error);
    }
  };
  const handlePublishToggle = async () => {
    setIsToggling(true);
    try {
      const response = await axios.patch(`/api/forms/${formId}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    } finally {
      setIsToggling(false);
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
      {/* Preview Banner */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          👁️ <strong>Preview Mode</strong> - This is how your form will look.
          Fields are disabled.
        </p>
      </div>

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
          {formData.isPublished ? (
            <div>
              {/* Published UI */}
              <p className="text-sm text-gray-600 mb-2">Share this form:</p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={`${window.location.origin}/f/${formData.slug}`}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded bg-white"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  {isCopied ? "Copied!" : "Copy Link"}
                </button>
              </div>
              <button
                type="button"
                onClick={handlePublishToggle}
                disabled={isToggling}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isToggling ? "Unpublishing..." : "Unpublish Form"}
              </button>
            </div>
          ) : (
            <div>
              {/* Unpublished UI */}
              <p className="text-sm text-gray-600 mb-3">
                This form is not published yet. Publish it to get a shareable
                link.
              </p>
              <button
                type="button"
                onClick={handlePublishToggle}
                disabled={isToggling}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isToggling ? "Publishing..." : "Publish Form"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
