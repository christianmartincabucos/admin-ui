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
          className={`px-4 py-2 rounded-md ${activeFormId === form.id ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
          onClick={() => onFormSelect(form.id)}
        >
          {form.name}
        </button>
      ))}
    </div>
  )
}
