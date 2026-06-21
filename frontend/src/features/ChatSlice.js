import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import toast from "react-hot-toast";

const initialState = {
  contacts: [],
  messages: [],
  activePartner: null,
  contactsStatus: "idle",
  historyStatus: "idle",
  sendStatus: "idle",
};

export const fetchContacts = createAsyncThunk(
  "chat/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/chat/contacts");
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "chat/fetchHistory",
  async (partnerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/chat/history/${partnerId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const postMessage = createAsyncThunk(
  "chat/postMessage",
  async ({ receiverId, text }, { rejectWithValue }) => {
    try {
      const res = await api.post("/chat/send", { receiverId, text });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActivePartner: (state, action) => {
      state.activePartner = action.payload;
    },
    receiveMessage: (state, action) => {
      // Only push message if it belongs to the active conversation
      const message = action.payload;
      if (
        state.activePartner &&
        (message.senderId === state.activePartner._id ||
          message.receiverId === state.activePartner._id)
      ) {
        state.messages.push(message);
      }
    },
    clearChatState: (state) => {
      state.contacts = [];
      state.messages = [];
      state.activePartner = null;
      state.contactsStatus = "idle";
      state.historyStatus = "idle";
      state.sendStatus = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.contactsStatus = "pending";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contactsStatus = "success";
        state.contacts = action.payload.contacts;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contactsStatus = "rejected";
        toast.error(action.payload.message || "Failed to load contacts");
      })

      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.historyStatus = "pending";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyStatus = "success";
        state.messages = action.payload.messages;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyStatus = "rejected";
        toast.error(action.payload.message || "Failed to load chat history");
      })

      // Post Message
      .addCase(postMessage.pending, (state) => {
        state.sendStatus = "pending";
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        state.sendStatus = "success";
        state.messages.push(action.payload.message);
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.sendStatus = "rejected";
        toast.error(action.payload.message || "Failed to send message");
      });
  },
});

export const { setActivePartner, receiveMessage, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
