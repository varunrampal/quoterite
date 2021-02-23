import { OrderTransportType, QuoteStatus, QuoteType } from './../enums/app-enums';
import { Icon } from 'react-feather';
export interface ICustomer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    alternatePhone: string;
    active: boolean;
}

export type CustomerState = {
    customers: ICustomer[];
    currentPage: number;
    totalRecords: number;
    filterRecords: boolean;
    searchStr: string;
};

export interface ITiles {
    type: string;
    href: string;
    icon: React.ComponentType<Icon>;
    title: string;
}

export interface IProperty {
    _id: string;
    custmail?: string;
    name: string;
    address: {
        street: String;
        city: String;
        state: string;
        postcode: String;
        country: String;
    };
    email: string;
    phone: string;
}

// Property

export type PropertyState = {
    properties: IProperty[];
    totalRecords: number;
    filterRecords: boolean;
    searchStr: string;
    selectedProperty?: any
};

//Item
export interface IItem {
    id: number;
    name: string;
    commonName?:string;
    quantity?: number;
    stock?:number;
    price?:number;
    qtyallotted?:any;
    totalprice?:number;
    totsum?:number;
    
}

//Quote
export interface IQuote {
    id?: number;
    submitedBy: string;
    property: string;
    items: IItem[];
    notes: string;
    type: QuoteType;
    createDate: string;
    status: QuoteStatus;
    transportType: OrderTransportType;
    transportDate: String;
    customerName?: string,
    customerEmail?:string,
    customerPhone?: string
}


export type QuoteState = {
    quotes: IQuote[];
    currentPage: number;
    totalRecords: number;
    filterRecords: boolean;
    searchStr: string;
    selectedQuote?:any
};

export type QuoteDetails = {
    id: number,
      user: {
        name:string
        email:string,
        phone:string
      },
      property: {
        _id: string;
        name: string,
        email: string,
        phone: string,
        address: {
            street: String;
            city: String;
            state: string;
            postcode: String;
            country: String;
        };
      },
      items: [{
        id: number,
        name: String,
        quantity: number,
        stock: number
     }],
      notes: string,
      type: string,
      createDate: string,
      status: string,
      transportType: string,
      transportDate: string
}


