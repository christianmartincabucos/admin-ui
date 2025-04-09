"use client"

import type { Form } from "@/lib/types"

interface FormTabsProps {
  forms: Form[]
  activeFormId: string
  onFormSelect: (formId: string) => void
}

export default function FormTabs({ forms, activeFormId, onFormSelect }: FormTabsProps) {
  return (
    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
      {forms.map((form) => (
        <button
          key={form.id}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeFormId === form.id
              ? "bg-white shadow-sm text-violet-700 font-medium"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => onFormSelect(form.id)}
        >
          {form.name}
        </button>
      ))}
    </div>
  )
}
