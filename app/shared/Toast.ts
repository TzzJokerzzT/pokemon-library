import { toast } from "@heroui/react";

interface ToastProps {
  color: "default" | "primary" | "secondary" | "success" | "danger" | "warning";
  description: string | null;
  title?: string;
  variant: "solid" | "bordered" | "flat";
  timeout?: number;
}

export function toasts({
  description = null,
  color,
  title,
  variant = "solid",
  timeout,
}: ToastProps) {
  return toast({
    color,
    description,
    title,
    variant,
    timeout,
  });
}
