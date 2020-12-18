import { PropertyState } from '../../types/appTypes';
import { getProperties, searchProperty } from './PropertiesActions';

type Actions =
    | ReturnType<typeof getProperties>
    | ReturnType<typeof searchProperty>;


const initialState: PropertyState = {
  properties: [],
  totalRecords: 0,
  filterRecords: false,
  searchStr: ''
}
const reducer = (state: PropertyState = initialState, action: Actions) => {
    switch(action.type) {
        case 'LOAD_PROPERTIES':
            return {
                ...state,
                properties: action.payload.properties,
                totalRecords: action.payload.totalRecords,
                filterRecords: action.payload.filterRecords,
                searchStr: action.payload.searchStr
            }
           default:
            return state;
    }
}

export default reducer;
