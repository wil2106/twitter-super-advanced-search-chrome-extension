export const getCookies = () => {
  let cookiesObject: {[key: string]: string} = {};
  const cookieArr = document.cookie.split(";");
  for(let i = 0; i < cookieArr.length; i++) {
        const [key, value] = cookieArr[i].split("=");
        cookiesObject[key.trim()] = decodeURIComponent(value);
  }
  return cookiesObject;
}