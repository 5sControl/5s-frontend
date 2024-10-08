let range = (start, end) =>
  [...Array(end - start).keys(), end - start].map((n) => start + n);
let A = range(65, 90); // A-Z
let a = range(97, 122); // a-z
let dig = range(48, 57); // 0-9
let all = A.concat(a).concat(dig); // Склеиваем в один

export function generateString(length = 10) {
  let str = "";

  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(all[Math.floor(Math.random() * all.length)]); // Берём случайное число, преобразуем в соответствующий символ и добавляем к строке
  }

  return str;
}
