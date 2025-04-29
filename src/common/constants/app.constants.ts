/* eslint-disable prettier/prettier */

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
