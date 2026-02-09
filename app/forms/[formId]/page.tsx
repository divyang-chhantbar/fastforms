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
          <option value="" className="text-gray-700">Select an option</option>
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

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
