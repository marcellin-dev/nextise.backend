/* eslint-disable prettier/prettier */
export enum TimeRange {
  TWENTY_FOUR_HOURS = '24h',
  SEVEN_DAYS = '7j',
  THIRTY_DAYS = '30j',
  ONE_MONTH = '1M',
  THREE_MONTHS = '3M',
  SIX_MONTHS = '6M',
  TWELVE_MONTHS = '12M',
  YEAR_TO_DATE = 'YTD',
  ALL_TIME = 'All',
}
export enum GroupBy {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum Event {
  NEW_TRANSACTION = 'newTransaction',
  TRANSACTION_CONFIRMED = 'transactionConfirmed',
}
