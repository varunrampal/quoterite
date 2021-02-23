export class Item{
    id: number;
    name: string;
    commonName: string
    qty: number;

    constructor(itemResponse: any) {
        this.id = itemResponse.itemId;
        this.name = itemResponse.name;
        this.qty = itemResponse.qty;
        this.commonName = itemResponse.commonName;
    }
}