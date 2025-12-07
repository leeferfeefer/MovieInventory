type UpcDBResponse = {
    code: string;
    total: number;
    offset: number;
    items: UpcDBItem[];
};

type UpcDBItem = {
    ean: string;
    title: string;
    description: string;
    upc: string;
    //   brand: string;
    //   model: string;
    //   color: string;
    //   size: string;
    //   dimension: string;
    //   weight: string;
    category: string;
    //   currency: Currency;
    //   lowest_recorded_price: number;
    //   highest_recorded_price: number;
    images: string[];
    //   offers: Offer[];
    asin: string;
    elid: string;
};
