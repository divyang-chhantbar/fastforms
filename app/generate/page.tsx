'use client'

import {useState } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";


export default function AiPrompt() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGenerate = async() => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.post('/api/forms/generate',{prompt});

            const {formId} = response.data;

            router.push(`/forms/${formId}`)

        } catch (error) {
            console.error("Form generation failed:", error);
            setError("Form generation failed. Please try again.");
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-4">
                <h1 className="text-3xl font-bold">Generate Form with AI</h1>
                
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your form... e.g., 'Contact form with name, email, and message'"
                    className="w-full h-40 p-4 border rounded-lg"
                />
                
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
                >
                    {isLoading ? "Generating..." : "Generate Form"}
                </button>
                
                {error && (
                    <div className="text-red-500 p-4 border border-red-500 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}