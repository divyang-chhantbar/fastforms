import { z } from "zod";

// Define the schema using Zod
const FormFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "text",
    "email",
    "date",
    "number",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "file",
  ]),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
    })
    .optional(),
});

export const FormSchemaValidator = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    fields: z.array(FormFieldSchema).min(1),
  })
  .refine(
    (data) => {
      // Check for duplicate field IDs
      const ids = data.fields.map((f) => f.id);
      return ids.length === new Set(ids).size;
    },
    { message: "Field IDs must be unique" },
  )
  .refine(
    (data) => {
      // Check select/radio/checkbox have options
      return data.fields.every((field) => {
        if (["select", "radio", "checkbox"].includes(field.type)) {
          return field.options && field.options.length > 0;
        }
        return true;
      });
    },
    { message: "Select/radio/checkbox fields must have options" },
  );

// Export the TypeScript type
export type FormSchema = z.infer<typeof FormSchemaValidator>;
export type FormField = z.infer<typeof FormFieldSchema>;

// Validation function
export function validateFormSchema(schema: unknown): FormSchema {
  return FormSchemaValidator.parse(schema); // Throws error if invalid
}

// Or safe validation (doesn't throw)
export function safeValidateFormSchema(schema: unknown) {
  return FormSchemaValidator.safeParse(schema);
}
