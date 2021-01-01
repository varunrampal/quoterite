import { IProperty } from '../interfaces/Properties';

export const GET_PROPERTIES = 'GET_PROPERTIES';

export type PropertyState = {
    properties: IProperty[];
    totalRecords: number;
    filterRecords: boolean;
    searchStr: string;
    selectedProperty: {}
};
interface GetPropertiesActionType {
    type: typeof GET_PROPERTIES;
    payload: PropertyState;
  }

  export type PropertiesActionTypes = GetPropertiesActionType;