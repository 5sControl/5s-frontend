import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getCountriesList, getSuppliers } from '../../api/companyRequest';
import { ContactInfoType, CountryType } from './types';

interface CompanyState {
  companies: ContactInfoType[];
  countryData: CountryType[];
}

const initialState: CompanyState = {
  companies: [],
  countryData: [],
};

export const getCompanies = createAsyncThunk(
  'getCompanies',
  async (data: { token: string; hostname: string }) => {
    try {
      const response = await getSuppliers(data.hostname, data.token);
      console.log('getSuppliers', response);
      return response.data;
    } catch (e) {
      console.log('getSuppliersError', e);
    }
  }
);
export const getCountries = createAsyncThunk(
  'getCountries',
  async (data: { token: string; hostname: string }) => {
    try {
      const response = await getCountriesList(data.hostname, data.token);
      return response.data;
    } catch (e) {
      console.log('getCountriesError', e);
    }
  }
);

const companySlice = createSlice({
  name: 'companyPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCountries.fulfilled, (state, action) => {
      state.countryData = action.payload;
    });
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.companies = action.payload;
    });
  },
});

export default companySlice.reducer;
export const companyState = (state: RootState) => state.companyState;
