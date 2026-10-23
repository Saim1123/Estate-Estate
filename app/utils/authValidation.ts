export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function passwordIssue(value: string): string {
  if (value.length < 10) return "Use at least 10 characters.";
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value))
    return "Include at least one lowercase and one uppercase letter.";
  if (!/\d/.test(value)) return "Include at least one number.";
  return "";
}
