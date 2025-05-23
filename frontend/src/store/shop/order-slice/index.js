import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  deliveryOrders: [],
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
        orderData,
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
        err.response?.data || { message: "Failed to create order" }
      );
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
        { paymentId, payerId, orderId },
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
        err.response?.data || { message: "Failed to capture payment" }
      );
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`,
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

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`,
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

export const fetchDeliveryOrders = createAsyncThunk(
  "/order/fetchDeliveryOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/delivery/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch delivery orders" }
      );
    }
  }
);

export const confirmDelivery = createAsyncThunk(
  "/order/confirmDelivery",
  async ({ id, confirmed, disputeReason }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (!token) {
        return rejectWithValue({ message: "No token provided" });
      }
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/shop/order/confirm-delivery/${id}`,
        { confirmed, disputeReason },
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
        err.response?.data || { message: "Failed to confirm delivery" }
      );
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(fetchDeliveryOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDeliveryOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryOrders = action.payload.data;
      })
      .addCase(fetchDeliveryOrders.rejected, (state) => {
        state.isLoading = false;
        state.deliveryOrders = [];
      })
      .addCase(confirmDelivery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmDelivery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = state.orderList.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
        state.deliveryOrders = state.deliveryOrders.map((order) =>
          order._id === action.payload.data._id ? action.payload.data : order
        );
        if (
          state.orderDetails &&
          state.orderDetails._id === action.payload.data._id
        ) {
          state.orderDetails = action.payload.data;
        }
      })
      .addCase(confirmDelivery.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
