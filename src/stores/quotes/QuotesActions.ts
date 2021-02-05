import { QuoteState } from '../../types/appTypes';
const SEARCH_QUOTE = "SEARCH_QUOTE";
const LOAD_QUOTES = "LOAD_QUOTES";
const SELECTED_QUOTE = "SELECTED_QUOTE";
const SELECTED_QUOTE_ITEMS = "SELECTED_QUOTE_ITEMS";

export const searchQuote = (payload: string) => {
    return {type: SEARCH_QUOTE, payload} as const;
};

export const loadQuotes = (payload: QuoteState) => {
    return {type: LOAD_QUOTES, payload} as const;
};

export const selectedQuote = (payload: number) => {
    return {type: SELECTED_QUOTE, payload} as const;
}


export const selectedQuoteItems = (payload: number) => {
    return {type: SELECTED_QUOTE_ITEMS, payload} as const;
}