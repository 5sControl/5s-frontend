export const isInvalidText = (value: string | undefined, allowNumbers?: boolean) => {
    if (!value) return false;
    const isInvalid = allowNumbers 
        ? /[^a-zA-Zа-яА-ЯёЁ0-9 _-]/
        : /\s|[^a-zA-Zа-яА-ЯёЁ_-]/;
        
    return isInvalid.test(value);
}