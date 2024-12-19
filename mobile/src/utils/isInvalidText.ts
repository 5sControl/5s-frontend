export const isInvalidText = (value: string | undefined) => {
    if (!value) return false;

    const isInvalid = /\s|[^a-zA-Zа-яА-ЯёЁ_-]/
    return isInvalid.test(value);
}