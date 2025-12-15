import type { DateRange } from "../interfaces";

interface FilterDateRangeOption {
  value: DateRange | "";
  label: string;
}

export const filtersDateRangeOptions: FilterDateRangeOption[] = [
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
