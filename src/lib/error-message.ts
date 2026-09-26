import axios from "axios";

/** Messages from our own routes are written for members; anything else gets the fallback. */
export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function isSessionEnded(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
