export interface Rate {
  from: string;
  to: string;
  in: number;
  out: number;
  reserve: number;
  date: string;
}

export interface Exchange {
  from: string;
  to: string;
  ask: number;
  date: string;
}

export interface ExchangeOffice {
  id: number;
  name: string;
  country: string;
  exchanges?: {
    exchange: Exchange[];
  };
  rates?: {
    rate: Rate[];
  };
}

export interface Country {
  code: {
    name: string;
    "#text": string;
  };
}

export interface Data {
  "exchange-offices": {
    "exchange-office": ExchangeOffice[];
  };
  countries: {
    country: Country[];
  };
}
