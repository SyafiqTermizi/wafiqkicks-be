import dayjs from "dayjs";

/* check if object has any keys */
export const isObjectEmpty = (obj: { [key: string]: string }) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

/* check if given date is today */
export const isDateToday = (date: any): Boolean =>
  dayjs().diff(date, "day") === 0;
