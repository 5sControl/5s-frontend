import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getCountriesList } from '../../api/companyRequest';
import { CountryType } from './types';

interface CompanyState {
  countryData: CountryType[];
}

const initialState: CompanyState = {
  countryData: [],
};

export const getCountries = createAsyncThunk(
  'getCountries',
  async (data: { token: string; hostname: string }) => {
    const response = await getCountriesList(data.hostname, data.token);
    return response.data;
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
  },
});

export default companySlice.reducer;
export const companyState = (state: RootState) => state.companyState;
