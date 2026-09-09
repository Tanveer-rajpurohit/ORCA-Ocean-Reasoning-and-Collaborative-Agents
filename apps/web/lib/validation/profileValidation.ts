export function validateFullName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Full name is required.";
  }
  if (trimmed.length < 2) {
    return "Please enter a valid full name (at least 2 characters).";
  }
  if (!/^[\p{L}\s.'-]+$/u.test(trimmed)) {
    return "Full name contains invalid characters.";
  }
  return null;
}

export function validatePhoneNumber(
  phone: string,
  required: boolean,
): string | null {
  const trimmed = phone.trim();
  if (!trimmed) {
    return required ? "Mobile number is required for hazard alerts." : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (local.length !== 10 || !/^[6-9]/.test(local)) {
    return "Enter a valid Indian mobile number (10 digits, starting 6-9).";
  }
  return null;
}

export function validateRegistrationId(id: string): string | null {
  const trimmed = id.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.length < 4 || trimmed.length > 20) {
    return "Vessel registration should be 4-20 characters.";
  }
  return null;
}
