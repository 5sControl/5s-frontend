export const getIsInternet = (URL) =>{
    return URL.includes('localhost') || URL.includes('com') ? true : false;
}