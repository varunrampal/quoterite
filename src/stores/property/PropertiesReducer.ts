import { PropertyState } from '../../types/appTypes';
import {
    getProperties,
    searchProperty,
    selectedProperty,
} from './PropertiesActions';

type Actions =
    | ReturnType<typeof getProperties>
    | ReturnType<typeof searchProperty>
    | ReturnType<typeof selectedProperty>;

const initialState: PropertyState = {
    properties: [],
    totalRecords: 0,
    filterRecords: false,
    searchStr: '',
    selectedProperty: {}

};
const reducer = (state: PropertyState = initialState, action: Actions) => {
    switch (action.type) {
        case 'LOAD_PROPERTIES':
            return {
                ...state,
                properties: action.payload.properties,
                totalRecords: action.payload.totalRecords,
                filterRecords: action.payload.filterRecords,
                searchStr: action.payload.searchStr,
            };
        case 'SELECTED_PROPERTY':
            const filteredProperty = state.properties.filter(
                (property) => property._id === action.payload,
            )[0];

            return {
                ...state,
                selectedProperty: filteredProperty,
            };
        default:
            return state;
    }
};

export default reducer;
