import type { CURRENCIES } from '../constants';

export type Currency = (typeof CURRENCIES)[number];

export enum PAYMENT_FILTER_TRIGGER {
  SEARCH = 'search',
  CURRENCY_CHANGE = 'currency_change',
  CLEAR = 'clear',
  PAGINATION = 'pagination',
  INITIAL_LOAD = 'initial_load'
}

export interface PaymentFilterValues {
  search: string;
  currency: Currency | "";
  page: number;
  trigger?: PAYMENT_FILTER_TRIGGER;
}