export const validateEmail = (email: string) => {
  if (!email) {
    return "Email is required";
  }

  if (email.length > 64) {
    return "Email must be less than 64 characters";
  }

  const regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  if (!regex.test(email)) {
    return "Email is invalid";
  }

  return null;
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 128) {
    return "Password must be less than 128 characters";
  }

  const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);

  if (!regex.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  return null;
};

export const validateUsername = (username: string) => {
  if (!username) {
    return "Username is required";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }

  if (username.length > 16) {
    return "Username must be less than 16 characters";
  }

  const regex = new RegExp(/^[a-zA-Z0-9]+$/);

  if (!regex.test(username)) {
    return "Username must contain only letters and numbers";
  }

  return null;
};
