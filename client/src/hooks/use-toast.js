import { toast as toastify } from "react-toastify";

export function toast({ title, description, variant = "info" }) {
  const message = title ? `${title}: ${description}` : description;

  switch (variant) {
    case "success":
      toastify.success(message);
      break;
    case "error":
    case "destructive":
      toastify.error(message);
      break;
    case "warning":
      toastify.warning(message);
      break;
    default:
      toastify.info(message);
      break;
  }
}