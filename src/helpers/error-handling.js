export const getAuthErrorMessage = (status) => {
  if (status === 401) {
    return "Invalid email or password";
  } else if (status === 400) {
    return "Invalid data. Please make sure your email is in a valid format and your password is at least 6 characters long.";
  } else if (status === 429) {
    return "Too many attempts. Please try again later.";
  } else if (status >= 500) {
    return "Server error. Please try again later.";
  } else {
    return "Unexpected error. Please try again.";
  }
};
