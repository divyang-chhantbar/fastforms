"use client";

import { withTamboInteractable } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { ChevronDown } from "lucide-react";

const FieldSchema = z.object({
  id: z.string().describe("Unique identifier (e.g., 'email_field')"),
  type: z.enum(["text", "email", "date", "number", "textarea", "select", "radio", "checkbox", "file"]),
  label: z.string().describe("The visible label"),
  placeholder: z.string().optional().describe("Hint text for the user"),
  required: z.boolean().optional().describe("Whether this field must be filled"),
  options: z.array(z.string()).optional().describe("Required if type is 'select', 'radio', or 'checkbox'"),
});

const FormSchema = z.object({
  title: z.string().describe("Form Title"),
  fields: z.array(FieldSchema).describe("The fields in the form"),
});

type FormProps = z.infer<typeof FormSchema> & { onUpdate?: (props: any) => void };

const FormUI = ({ title, fields, onUpdate }: FormProps) => {
  const lastState = useRef({ title, fields });
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Only trigger onUpdate if the ACTUAL data has changed (title or fields)
  useEffect(() => {
    // Data Sanitation: Ensure selection fields always have options to satisfy backend
    const sanitizedFields = fields.map((f, i) => {
      const id = f.id || `field_${i}_${Date.now()}`;
      if (["select", "radio", "checkbox"].includes(f.type) && (!f.options || f.options.length === 0)) {
        return { ...f, id, options: ["Option 1"] };
      }
      return { ...f, id };
    });

    if (
      lastState.current.title === title &&
      JSON.stringify(lastState.current.fields) === JSON.stringify(sanitizedFields)
    ) {
      return;
    }

    lastState.current = { title, fields: sanitizedFields };
    if (onUpdateRef.current) {
      onUpdateRef.current({ title, fields: sanitizedFields });
    }
  }, [title, fields]);

  const commonClasses = "w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-zinc-600 appearance-none";

  const renderField = (field: any) => {
    switch (field.type) {
      case "textarea":
        return <textarea placeholder={field.placeholder} className={`${commonClasses} min-h-[120px] resize-none`} disabled />;
      
      case "select":
        return (
          <div className="relative">
            <select className={commonClasses} disabled>
              <option value="">Select an option</option>
              {field.options?.map((opt: string) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
        );

      case "radio":
      case "checkbox":
        return (
          <div className="space-y-3 mt-2">
            {field.options?.map((opt: string) => (
              <label key={opt} className="flex items-center gap-3 opacity-70">
                <input type={field.type} className="w-4 h-4 text-indigo-500 bg-white/5 border-white/20 rounded-md" disabled />
                <span className="text-zinc-300 text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );

      case "file":
         return (
           <div className={commonClasses}>
             <span className="text-zinc-500 text-sm">Choose File No file chosen</span>
           </div>
         );

      default:
        return <input type={field.type} placeholder={field.placeholder} className={commonClasses} disabled />;
    }
  };

  return (
    <div className="rounded-[2.5rem] bg-black/50 border border-white/[0.08] backdrop-blur-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.2] to-transparent pointer-events-none" />
      
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
        {title}
      </h1>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field, index) => (
          <div key={`${field.id}-${index}`} className="space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <label className="block text-sm font-medium text-zinc-300 tracking-wide ml-1">
              {field.label}
              {field.required && <span className="text-indigo-400 ml-1.5">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </form>
    </div>
  );
};

export const SmartForm = withTamboInteractable(FormUI, {
  componentName: "FastForm",
  description: "The main form editor. You can add, remove, or edit fields and titles.",
  propsSchema: FormSchema,
});
