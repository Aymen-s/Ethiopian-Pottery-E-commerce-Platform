import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  deliveryGuys: [],
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch orders" }
      );
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch order details" }
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
        { orderStatus },
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
        err.response?.data || { message: "Failed to update order status" }
      );
    }
  }
);

export const fetchDeliveryGuys = createAsyncThunk(
  "/admin/fetchDeliveryGuys",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users/delivery-guys`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch delivery guys" }
      );
    }
  }
);

export const assignDeliveryGuyAndUpdateStatus = createAsyncThunk(
  "/admin/assignDeliveryGuyAndUpdateStatus",
  async ({ id, assignedDeliveryGuy, orderStatus }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
        { assignedDeliveryGuy, orderStatus },
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
        err.response?.data || { message: "Failed to assign delivery guy" }
      );
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          state.orderDetails &&
          state.orderDetails._id === action.payload.data._id
        ) {
          state.orderDetails = action.payload.data;
        }
        state.orderList = state.orderList.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchDeliveryGuys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDeliveryGuys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryGuys = action.payload.data;
      })
      .addCase(fetchDeliveryGuys.rejected, (state) => {
        state.isLoading = false;
        state.deliveryGuys = [];
      })
      .addCase(assignDeliveryGuyAndUpdateStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignDeliveryGuyAndUpdateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          state.orderDetails &&
          state.orderDetails._id === action.payload.data._id
        ) {
          state.orderDetails = action.payload.data;
        }
        state.orderList = state.orderList.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
      })
      .addCase(assignDeliveryGuyAndUpdateStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
