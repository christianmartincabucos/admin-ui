export interface Field {
  id: string
  type: string
  label: string
  required: boolean
  order: number
  placeholder?: string
  description?: string
  options?: string[]
  defaultValue?: string | boolean | Date
}

export interface DragItem {
  index: number
  id: string
  type: string
}

export interface FieldType {
  id: string
  label: string
  icon: string
}

export interface Form {
  id: string
  name: string
  fields: Field[]
}
