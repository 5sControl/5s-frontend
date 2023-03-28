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
  indeks: number;
  data: string;
  datawejscia: string;
  klient: string;
  status: string;
  terminrealizacji: string;
  zlecenie: string;
  datazakonczenia: string;
  products: OrderByCustomer[];
}

export interface OrderWithPaginationCustomer {
  current_page: number;
  all_page_count: number;
  count: number;
  next: string | null;
  previous: string | null;
  records_on_page: number;
  results: OrderRequest[];
}
