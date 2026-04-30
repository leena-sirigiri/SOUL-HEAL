const PROFILE_KEY = "userProfile";

const defaultProfile = {
  name: "SoulHeal User",
  email: "",
  photo: "",
  preferredSound: "Ocean",
  goal: "Find a calmer rhythm every day",
  intention: "One mindful pause at a time",
};

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

export function getStoredUserProfile() {
  const savedProfile = readJson(PROFILE_KEY) || {};
  const savedUser = readJson("user") || {};

  return {
    ...defaultProfile,
    ...savedProfile,
    name: savedProfile.name || savedUser.name || defaultProfile.name,
    email: savedProfile.email || savedUser.email || defaultProfile.email,
  };
}

export function saveUserProfile(updates) {
  const nextProfile = {
    ...getStoredUserProfile(),
    ...updates,
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));

  const savedUser = readJson("user") || {};
  localStorage.setItem(
    "user",
    JSON.stringify({
      ...savedUser,
      name: nextProfile.name,
      email: nextProfile.email,
      photo: nextProfile.photo,
    })
  );

  return nextProfile;
}

export function getInitials(name) {
  return (name || "SoulHeal User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export const profileOptions = ["Ocean", "Waterfall", "Rain", "Forest"];
