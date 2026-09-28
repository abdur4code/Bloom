export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  const responseData = error?.response?.data;
  const validationErrors = responseData?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors
      .map((validationError) => validationError.msg)
      .filter(Boolean)
      .join(', ');
  }

  return responseData?.message || responseData?.error || fallback;
}
