import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FiltersState } from "../types";

const initialState: FiltersState = {
  search: "",
  category: "",
  paymentMethod: "",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
  sortBy: "date",
  order: "desc",
  page: 1,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<FiltersState>>) {
      Object.assign(state, action.payload);
      // Any filter change resets to page 1, unless the caller set page explicitly
      if (action.payload.page === undefined) {
        state.page = 1;
      }
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilter, setPage, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;