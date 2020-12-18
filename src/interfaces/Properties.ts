export interface IProperty {
    __id: string;
    custmail: string;
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