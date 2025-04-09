import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CalendarIcon, CheckSquare, TextIcon, ListIcon, ToggleLeft, FileText, Mail, Phone, Hash } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIconComponent(iconName: string) {
  switch (iconName) {
    case "text":
      return <TextIcon className="w-5 h-5" />
    case "checkbox":
      return <CheckSquare className="w-5 h-5" />
    case "calendar":
      return <CalendarIcon className="w-5 h-5" />
    case "list":
      return <ListIcon className="w-5 h-5" />
    case "toggle":
      return <ToggleLeft className="w-5 h-5" />
    case "file":
      return <FileText className="w-5 h-5" />
    case "email":
      return <Mail className="w-5 h-5" />
    case "phone":
      return <Phone className="w-5 h-5" />
    case "number":
      return <Hash className="w-5 h-5" />
    default:
      return <TextIcon className="w-5 h-5" />
  }
}
