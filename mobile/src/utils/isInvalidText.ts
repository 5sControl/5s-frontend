interface Allows {
    numbers?: boolean;
    spaces?: boolean;
}

export const isInvalidText = (value: string | undefined, allows: Allows = {}) => {
    const { numbers = false, spaces = false } = allows;

    if (!value) return false;
    
    let allowedSymbols = '-_a-zA-Zа-яА-ЯёЁ';
    if (numbers) {
        allowedSymbols += '0-9';
    } 
    if (spaces) {
        allowedSymbols += ' ';
    }

    const regex = new RegExp(`[^${allowedSymbols}]`); 
    return regex.test(value); 
}