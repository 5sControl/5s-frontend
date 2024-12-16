import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  getCompanyInfoForm,
  getCountriesList,
  getSuppliers,
} from "../../api/companyRequest";
import { ContactInfoType, CountryType } from "./types";

interface CompanyState {
  companies: ContactInfoType[];
  countryData: CountryType[];
  companyInfoForm: ContactInfoType[];
}

const initialState: CompanyState = {
  companies: [],
  countryData: [],
  companyInfoForm: [],
};

export const getCompanies = createAsyncThunk(
  "getCompanies",
  async (data: { token: string; hostname: string }) => {
    try {
      const response = await getSuppliers(data.hostname, data.token);
      return response.data;
    } catch (e) {
      console.log("getSuppliersError", e);
    }
  }
);

export const getCountries = createAsyncThunk(
  "getCountries",
  async (data: { token: string; hostname: string }) => {
    try {
      const response = await getCountriesList(data.hostname, data.token);
      return response.data;
    } catch (e) {
      console.log("getCountriesError", e);
    }
  }
);

export const getCompanyInfoForForm = createAsyncThunk(
  "getCompanyInfoForForm",
  async (data: { token: string; hostname: string }) => {
    try {
      const response = await getCompanyInfoForm(data.hostname, data.token);
      return response.data;
    } catch (e) {
      console.log("companyInfoFormError", e);
    }
  }
);

const companySlice = createSlice({
  name: "companyPage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCountries.fulfilled, (state, action) => {
      state.countryData = action.payload;
    });
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.companies = action.payload;
    });
    builder.addCase(getCompanyInfoForForm.fulfilled, (state, action) => {
      state.companyInfoForm = action.payload;
    });
  },
});

export default companySlice.reducer;
export const companyState = (state: RootState) => state.companyState;
