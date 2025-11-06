import type { ClientType } from "../interfaces";

interface TypeOption {
  value: ClientType | "";
  label: string;
}

export const typesOptions : TypeOption[] = [
  { value: 'Regular', label: 'Regular' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Ocasional', label: 'Ocasional' },
] as const;