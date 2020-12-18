import { CustomerState } from '../../types/appTypes';
const SEARCH_CUSTOMER = "SEARCH_CUSTOMER";
const LOAD_CUSTOMERS = "LOAD_CUSTOMERS";
const LOAD_NEW_PAGE = "LOAD_NEW_PAGE";
const LOAD_EXACT_PAGE = "LOAD_EXACT_PAGE";

export const searchCustomer = (payload: string) => {
    return {type: SEARCH_CUSTOMER, payload} as const;
};

export const loadCustomers = (payload: CustomerState) => {
    return {type: LOAD_CUSTOMERS, payload} as const;
};

