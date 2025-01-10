export const isInvalidText = (value: string | undefined, allowNumbers?: boolean, allowSpaces: boolean = true) => {
    if (!value) return false;

    let regex: RegExp;

    if (allowNumbers) {
        regex = allowSpaces 
            ? /[^a-zA-Zа-яА-ЯёЁ0-9 _-]/ 
            : /[^a-zA-Zа-яА-ЯёЁ0-9_-]/;
    } else {
        regex = allowSpaces 
            ? /[^a-zA-Zа-яА-ЯёЁ _-]/ 
            : /\s|[^a-zA-Zа-яА-ЯёЁ_-]/;
    }

    return regex.test(value);
}