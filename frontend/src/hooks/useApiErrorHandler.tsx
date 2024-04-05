import { AxiosError } from "../api";
import { toast } from "react-toastify";

export const useApiErrorHandler = () => {
  const handleApiError = (error: AxiosError) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An error occurred while processing your request.");
    }
  };

  return handleApiError;
}