const logInChecks = (user) => {
  if (!user.isVerified) {
    return "email-unverified";
  }
  if (user.role === "food-enthusiast") {
    if (!user.isProfileCompleted) {
      return "Food Enthusiast-profile-setup-pending";
    }
    if (!user.isVerified) {
      return "Food Enthusiast-email-verification-pending";
    }
    if (user.forgotVerification) {
      return "Food Enthusiast-password-creation-permission-granted";
    }
  } else if (user.role === "admin") {
    if (!user.isProfileCompleted) {
      return "Admin-profile-setup-pending";
    }
    if (!user.isVerified) {
      return "Admin-Email-verification-pending";
    }
    if (user.forgotVerification) {
      return "Admin-password-creation-permission-granted";
    }
  } else if (user.role === "chef") {
    if (!user.isProfileCompleted) {
      return "Chef-profile-setup-pending";
    }
    if (!user.isVerified) {
      return "Chef-Email-verification-pending";
    }
  } else if (user.role === "farmer") {
    if (!user.isProfileCompleted) {
      return "Farmer-profile-setup-pending";
    }
    if (!user.isVerified) {
      return "Farmer-Email-verification-pending";
    }
  } else {
    return "Invalid userType";
  }
  return "login-granted";
};

module.exports = { logInChecks };
