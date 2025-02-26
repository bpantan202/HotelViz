import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interface";

type BookState = {
  bookItems: BookingItem[];
};

const initialState: BookState = { bookItems: [] };

export const bookSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const newBookItems = state.bookItems.filter((obj) => {
        return obj.id !== action.payload.id;
      });
      newBookItems.push(action.payload);
      state.bookItems = newBookItems;
    },
    removeBooking: (state, action: PayloadAction<String>) => {
      const remainItems = state.bookItems.filter((obj) => {
        if(obj.id !== action.payload) console.log(5);
        return obj.id !== action.payload;
      });
      state.bookItems = remainItems;
    },
  },
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
