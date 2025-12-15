import { getStartOfDay } from "./getStartOfDay";

interface DateRangeInput {
  dateRange: string;
}

interface DateRangeOutput {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const calculateDateRange = ({
  dateRange,
}: DateRangeInput): DateRangeOutput => {
  const today = getStartOfDay(new Date());
  switch (dateRange) {
    case "today": {
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      return {
        startDate: today,
        endDate: endOfToday,
      };
    }
    case "week": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return {
        startDate: startOfWeek,
        endDate: endOfWeek,
      };
    }
    case "month": {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return {
        startDate: startOfMonth,
        endDate: endOfMonth,
      };
    }
    default:
      return { startDate: undefined, endDate: undefined };
  }
};
