import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  isLoading: false,
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to add product" }
      );
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchallproducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/products/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch products" }
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteproduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to delete product" }
      );
    }
  }
);

export const editProduct = createAsyncThunk(
  "/products/editproduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to update product" }
      );
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = [...state.products, action.payload.data];
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.data._id
        );
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.map((product) =>
          product._id === action.payload.data._id
            ? action.payload.data
            : product
        );
      })
      .addCase(editProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default AdminProductsSlice.reducer;
