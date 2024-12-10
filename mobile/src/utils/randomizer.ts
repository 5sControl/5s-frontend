let range = (start: number, end: number) =>
  [...Array(end - start).keys(), end - start].map((n) => start + n);
let A = range(65, 90); // A-Z
let a = range(97, 122); // a-z
let dig = range(48, 57); // 0-9
let all = A.concat(a).concat(dig); // Склеиваем в один

export function generateString(length: number = 10): string {
  let str: string = "";

  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(all[Math.floor(Math.random() * all.length)]); // Берём случайное число, преобразуем в соответствующий символ и добавляем к строке
  }

  return str;
}
