import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({ apiKey });

const systemPrompt = `
You are a form schema generator.
Generate a JSON form schema based on the user's requirements.

Return ONLY valid JSON in the following format:
{
  "title": "Form Title",
  "fields": [
  {
    "id" : "unique_field_id",
    "type": "text" | "number" | "email" | "date" | "select" | "checkbox" | "radio" | "textarea" | "file",
    "label": "Field Label",
    "required": true | false,
    "placeholder": "Placeholder text",
    "options": ["Option 1", "Option 2"] // Only for select, checkbox, radio types
    "validation": {
    "min" : 0,
    "max" : 100,
  }
}  ]
}
Support the following field types: text, number, email, date, select, checkbox, radio.
Make IDs unique and descriptive.
Ensure the JSON is well-formed.
`;
export const generateFormSchema = async (userPrompt: string) => {
    let parsed;
    try {
        const completion = await groq.chat.completions.create({
            messages : [
                {role : "system",content : systemPrompt},
               {role : "user" , content : userPrompt} 
            ],
            model : "llama-3.3-70b-versatile",
            temperature : 0.7,
            max_tokens : 2000,
            response_format : {type : 'json_object'}
        })
        const content = completion.choices[0].message.content;
        console.log("Groq API response content : ",content);
        if (!content) {
            throw new Error("No content received from API");
        }
        try {
            parsed = JSON.parse(content);
        } catch (error) {
            throw new Error(`AI returned invalid JSON :  ${error}`);
        }
        return parsed;
    } catch (error) {
        console.log("Groq API error : ",error);
        throw new Error("Error in generating form schema");
    }
}