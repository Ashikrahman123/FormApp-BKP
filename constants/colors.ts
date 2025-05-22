const primaryColor = "#4A6FA5";
const secondaryColor = "#6B8CC7";
const backgroundColor = "#F8F9FB";
const textColor = "#333333";
const errorColor = "#E53935";
const successColor = "#43A047";

// Dark theme colors
const darkPrimaryColor = "#5D82B3";
const darkSecondaryColor = "#7E9DD4";
const darkBackgroundColor = "#121212";
const darkCardColor = "#1E1E1E";
const darkTextColor = "#E0E0E0";
const darkBorderColor = "#333333";

export default {
  light: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: backgroundColor,
    card: "#FFFFFF",
    text: textColor,
    border: "#E1E5EB",
    notification: primaryColor,
    error: errorColor,
    success: successColor,
    placeholder: "#9DA3B4",
    inactive: "#C5CAD5",
    tabIconDefault: "#9DA3B4",
    tabIconSelected: primaryColor,
  },
  dark: {
    primary: darkPrimaryColor,
    secondary: darkSecondaryColor,
    background: darkBackgroundColor,
    card: darkCardColor,
    text: darkTextColor,
    border: darkBorderColor,
    notification: darkPrimaryColor,
    error: errorColor,
    success: successColor,
    placeholder: "#6D7280",
    inactive: "#4B5563",
    tabIconDefault: "#6D7280",
    tabIconSelected: darkPrimaryColor,
  }
};