export interface OrderByCustomer {
  id: number;
  data: string;
  datawejscia: string;
  indeks: number;
  klient: string;
  orderName: string;
  skans: OrderSkan[];
  status: string;
  terminrealizacji: string;
  typ: string;
  zakonczone: number;
  zlecenie: string;
}

export interface OrderListByCustomer {
  zlecenie: string;
  status: string;
  indeks: number;
  terminrealizacji: string;
}

export interface OrderSkan {
  data: string;
  indeks: number;
  raport: string;
  stanowisko: number;
  uzytkownik: number;
  worker: string;
}

export interface OrderRequest {
  data: string;
  datawejscia: string;
  klient: string;
  status: string;
  terminrealizacji: string;
  zlecenie: string;
  products: OrderByCustomer[];
}
