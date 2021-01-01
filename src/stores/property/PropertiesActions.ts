import { PropertyState } from '../../types/appTypes';
const SEARCH_PROPERTIES = "SEARCH_PROPERTIES";
const LOAD_PROPERTIES = "LOAD_PROPERTIES";
const SELECTED_PROPERTY = "SELECTED_PROPERTY";

export const searchProperty = (payload: string) => {
    return {type: SEARCH_PROPERTIES, payload} as const;
};

export const getProperties = (payload: PropertyState) => {
    return {type: LOAD_PROPERTIES, payload} as const;
};

export const selectedProperty = (payload: string) => {
    return {type: SELECTED_PROPERTY, payload} as const;
}

