const socialChecks = (user) => {
  if (user.role === "farmer") {
    if (!user.isProfileCompleted) {
      return "Farmer-profile-setup-pending";
    }
    if (user.forgotVerification) {
      return "Farmer-password-creation-permission-granted";
    }
  } else if (user.role === "admin") {
    if (!user.isProfileCompleted) {
      return "Admin-profile-setup-pending";
    }
    if (user.forgotVerification) {
      return "Admin-password-creation-permission-granted";
    }
  } else if (user.role === "chef") {
    if (!user.isProfileCompleted) {
      return "Chef-profile-setup-pending";
    }
    if (user.forgotVerification) {
      return "Chef-password-creation-permission-granted";
    }
  } else if (user.role === "food-enthusiast") {
    if (!user.isProfileCompleted) {
      return "Food Enthusiast-profile-setup-pending";
    }
    if (user.forgotVerification) {
      return "Food Enthusiast-password-creation-permission-granted";
    }
  } else {
    return "Invalid userType";
  }
  return "login-granted";
};

module.exports = { socialChecks };
