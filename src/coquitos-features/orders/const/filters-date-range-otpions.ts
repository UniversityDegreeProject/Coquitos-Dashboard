import { type DateRange } from "../interfaces";

interface DateRangeOptions {
  value: DateRange;
  label: string;
}

export const filtersDateRangeOptions: DateRangeOptions[] = [
  {
    value: "today",
    label: "Hoy",
  },
  {
    value: "week",
    label: "Semana",
  },
  {
    value: "month",
    label: "Mes",
  },
];
