export const isInvalidText = (value: string | undefined) => {
    if (!value) return false;

    const isInvalid = /\s|[^a-zA-Zа-яА-ЯёЁ]/;
    return isInvalid.test(value);
}