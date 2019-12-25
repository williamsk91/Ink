import { ValidationError } from "yup";

export const formatYupError = (
  err: ValidationError
): { path: string; message: string }[] =>
  err.inner.map(e => ({
    path: e.path,
    message: e.message
  }));
