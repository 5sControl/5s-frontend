import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWorkplace } from '../models/interfaces/workplace.interface';

interface WorkplaceState {
  selectedWorkplace: IWorkplace | null;
}

const initialState: WorkplaceState = {
  selectedWorkplace: null,
};

const workplaceSlice = createSlice({
  name: 'workplace',
  initialState,
  reducers: {
    setSelectedWorkplace: (state, action: PayloadAction<IWorkplace | null>) => {
      state.selectedWorkplace = action.payload;
    },
  },
});

export const { setSelectedWorkplace } = workplaceSlice.actions;
export default workplaceSlice.reducer;