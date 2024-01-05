import { format, parseISO } from "date-fns";

export const formatDate = (
  date: string,
  formatString = "do MMM yy kk:mm:ss"
) => {
  if (date) return format(parseISO(date), formatString);

  return;
};
