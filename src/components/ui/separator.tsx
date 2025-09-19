"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full bg-gray-200" : "h-full w-[1px] bg-gray-200",
        className
      )}
      {...props}
    />
  )
}

export { Separator } 