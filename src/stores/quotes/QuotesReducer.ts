import { QuoteState } from '../../types/appTypes';
import { searchQuote, loadQuotes } from './QuotesActions';

type Actions =
    | ReturnType<typeof searchQuote>
    | ReturnType<typeof loadQuotes>;


const initialState: QuoteState = {
  quotes: [],
  currentPage: 0,
  totalRecords: 0,
  filterRecords: false,
  searchStr: ''
}
const reducer = (state: QuoteState = initialState, action: Actions) => {
    switch(action.type) {
        case 'LOAD_QUOTES':
            return {
                ...state,
                quotes: action.payload.quotes,
                currentPage: action.payload.currentPage,
                totalRecords: action.payload.totalRecords,
                filterRecords: action.payload.filterRecords,
                searchStr: action.payload.searchStr
            }
            case 'SEARCH_QUOTE':
             const filteredQuotes = state.quotes.filter(
              (quote) =>
                  quote.id === Number(action.payload) //||
                  //quote.customerName.includes(action.payload),
          );
         
            return {
                ...state,
                quotes: filteredQuotes,
              
            };
        default:
            return state;
    }
}

export default reducer;
