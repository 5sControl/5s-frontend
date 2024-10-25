export const getCookieValueByName = (cookieName: string): string | undefined => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
  return tokenCookie ? removeSpace(tokenCookie.split('=')[1]) : undefined;
};
const removeSpace = (token: string) => token.replace('%20', ' ');

export const isEquals = (arr1: unknown[], arr2: unknown[]) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};
