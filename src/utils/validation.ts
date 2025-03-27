import { sanitizeString } from "./general";

const VALID_PHONE_LENGTH = 13;

export function isValidPhoneNumber(phone: string): boolean {
    if (!phone) return false;

    const sanitizedPhone = sanitizeString(phone);
    return sanitizedPhone?.length === VALID_PHONE_LENGTH;
}

export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}