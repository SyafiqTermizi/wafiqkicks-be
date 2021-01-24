import dayjs from "dayjs";

/* check if object has any keys */
export const isObjectEmpty = (obj: { [key: string]: string }) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

/* check if given date is today */
export const isDateToday = (date: any): Boolean =>
  dayjs().diff(date, "day") === 0;

export const createArrayFromCount = (
  count: number,
  useCounter: boolean
): string[] => {
  const TOTAL_MOVEMENT = 10;
  const emptyThCount = TOTAL_MOVEMENT - count;
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(`${useCounter ? i + 1 : "x"}`);
  }
  for (let j = 0; j < emptyThCount; j++) {
    arr.push("");
  }
  return arr;
};
