import { QuoteState } from '../../types/appTypes';
const SEARCH_QUOTE = "SEARCH_QUOTE";
const LOAD_QUOTES = "LOAD_QUOTES";

export const searchQuote = (payload: string) => {
    return {type: SEARCH_QUOTE, payload} as const;
};

export const loadQuotes = (payload: QuoteState) => {
    return {type: LOAD_QUOTES, payload} as const;
};

