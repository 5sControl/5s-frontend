export const getCookieValueByName = (cookieName: string): string | undefined => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((row) => row.startsWith(`${cookieName}=`));

    return tokenCookie ? removeSpace(tokenCookie.split('=')[1]) : undefined;
};
const removeSpace = (token: string) => token.replace('%20',' ')

