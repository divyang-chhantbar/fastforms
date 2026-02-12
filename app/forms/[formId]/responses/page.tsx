"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

type Response = {
  id: string;
  formId: string;
  data: Record<string, any>;
  createdAt: string;
};

export default function ResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [formTitle, setFormTitle] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        if (!formId) return;
        const response = await axios.get<{
          success: boolean;
          formTitle: string;
          totalResponses: number;
          responses: Response[];
        }>(`/api/forms/${formId}/responses`);
        setFormTitle(response.data.formTitle);
        setResponses(response.data.responses);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error ?? err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchResponses();
  }, [formId]);
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (responses.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">{formTitle}</h1>
        <p className="text-gray-600">No responses yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">{formTitle}</h1>
      <p className="text-gray-600 mb-6">
        {responses.length} {responses.length === 1 ? "response" : "responses"}
      </p>

      <div className="space-y-6">
        {responses.map((response) => (
          <div key={response.id} className="border rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-4">
              Submitted on {new Date(response.createdAt).toLocaleString()}
            </p>

            <div className="space-y-2">
              {Object.entries(response.data).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-1">
                  <span className="font-medium capitalize">{key}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
