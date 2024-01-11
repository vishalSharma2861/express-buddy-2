export enum BOOKING_TYPE {
  NOW = 'NOW',
  LATER = 'LATER',
  ADVANCE = 'ADVANCE',
}

export enum VELET_TYPE {
  NORMAL = 'NORMAL',
  PRIORITY = 'PRIORITY',
}

export enum PAYMENT_TYPE {
  CASH = 'CASH',
  CARD = 'CARD',
}

export enum BOOKING_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DECLINED = 'DECLINED',
  STARTED = 'STARTED',
  ASSIGNED = 'ASSIGNED',
  ARRIVED = 'ARRIVED',
  CUSTOMER_NO_SHOW = 'CUSTOMER_NO_SHOW',
  DELETED = 'DELETED',
  // only for notification (it is not for booking status)
  DELAY_CHARGES = 'DELAY_CHARGES',
}
export enum BOOKING_STATUS_HIERARCHY {
  PENDING,
  ASSIGNED,
  ACCEPTED,
  ARRIVED,
  CUSTOMER_NO_SHOW,
  CANCELLED,
  DECLINED,
  STARTED,
  COMPLETED,
}

export enum EARNING_LIST_TYPE {
  TOTAL = 'TOTAL',
  TODAY = 'TODAY',
  ADMIN = 'ADMIN',
}

export enum BOOKING_ISSUE {}