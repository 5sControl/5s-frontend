export const isInvalidText = (value: string | undefined, allowNumbers?: boolean) => {
    console.log(value);
    if (!value) return false;

    const isInvalid = allowNumbers 
        ? /\s|[^a-zA-Zа-яА-ЯёЁ0-9_-]/
        : /\s|[^a-zA-Zа-яА-ЯёЁ_-]/;

        console.log(isInvalid.test(value));
    return isInvalid.test(value);
}