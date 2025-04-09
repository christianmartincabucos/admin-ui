"use client"

import FormPreview from "./form-preview"
import type { Form, FieldType } from "@/lib/types"

interface FormPreviewSectionProps {
  form: Form
  fieldTypes: FieldType[]
  onExitPreview: () => void
}

export default function FormPreviewSection({ form, fieldTypes, onExitPreview }: FormPreviewSectionProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{form?.name} - Preview</h2>
        <button onClick={onExitPreview} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
          Back to Editor
        </button>
      </div>
      <FormPreview fields={form?.fields || []} fieldTypes={fieldTypes} />
    </div>
  )
}
