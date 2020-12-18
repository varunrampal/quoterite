import { CustomerState } from '../../types/appTypes';
import { searchCustomer, loadCustomers } from './CustomersActions';

type Actions =
    | ReturnType<typeof searchCustomer>
    | ReturnType<typeof loadCustomers>;


const initialState: CustomerState = {
  customers: [],
  currentPage: 0,
  totalRecords: 0,
  filterRecords: false,
  searchStr: ''
}
const reducer = (state: CustomerState = initialState, action: Actions) => {
    switch(action.type) {
        case 'LOAD_CUSTOMERS':
            return {
                ...state,
                customers: action.payload.customers,
                currentPage: action.payload.currentPage,
                totalRecords: action.payload.totalRecords,
                filterRecords: action.payload.filterRecords,
                searchStr: action.payload.searchStr
            }
            case 'SEARCH_CUSTOMER':
             const filteredCustomers = state.customers.filter(
              (customer) =>
                  customer.name.includes(action.payload) ||
                  customer.email.includes(action.payload),
          );
         
            return {
                ...state,
                customers: filteredCustomers,
              
            };
        default:
            return state;
    }
}

export default reducer;
