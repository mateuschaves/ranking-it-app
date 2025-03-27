export function sanitizeString(string: string): string {
    if (!string) return '';
    
    return string.replace(/[^\d]/g, '');
}

export function formatPhoneNumber(value: string) {
    const phoneNumber = value.replace('+55', '').replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 3) return value;
    if (phoneNumberLength < 8) return `+55 (${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    return `+55 (${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};