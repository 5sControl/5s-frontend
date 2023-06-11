export type CompanyInfoType = {
  company_active_count_cameras: number;
  company_active_count_neurons: number;
  date_joined: string;
  days_left: string;
  licence_count_cameras: number;
  licence_is_active: true;
  licence_neurons_active: number;
  name_company: string;
  valid_until: string;
};

export type ContactInfoType = {
  id?: number;
  name_company: string;
  contact_email: string;
  website: string;
  city?: string | null;
  contact_mobile_phone?: string | null;
  contact_phone?: string | null;
  date_edited?: string;
  date_joined?: string;
  file?: File | null;
  logo?: string | null;
  state?: string | null;
  country?: string | null;
  first_address?: string | null;
  second_address?: string | null;
  index?: number | null;
};

export type CountryType = {
  name: string;
  code: string;
};
