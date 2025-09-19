import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ 
  className, 
  variant = "default", 
  ...props 
}: BadgeProps) {
  const variantClasses = {
    default: "bg-green-600 text-white",
    secondary: "bg-white text-gray-700 border border-gray-200",
    destructive: "bg-red-500 text-white",
    outline: "bg-transparent border border-green-300 text-green-700",
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge } 