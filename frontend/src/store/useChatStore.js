import { create } from "zustand";
import toast from "react-hot-toast";
import { useauthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  visible: [],

  // 🧩 Fetch all users for sidebar
  getUsers: async () => {
    const socket = useauthStore.getState().socket;
    const currentUser = useauthStore.getState().authUser;
    if (!socket || !currentUser) return;

    set({ isUsersLoading: true });
    socket.emit("getUsersForSidebar", currentUser._id, (res) => {
      if (res.error) toast.error(res.error);
      else set({ users: res });
      set({ isUsersLoading: false });
    });
  },

  // 💬 Fetch previous chat messages
  getMessages: async (userId) => {
    const socket = useauthStore.getState().socket;
    const currentUser = useauthStore.getState().authUser;
    if (!socket || !currentUser) return;

    set({ isMessagesLoading: true });
    socket.emit("getMessages", { myId: currentUser._id, userToChatId: userId }, (res) => {
      if (res.error) toast.error(res.error);
      else set({ messages: res });
      set({ isMessagesLoading: false });
    });
  },

  // 🚀 Send message (text/image)
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const socket = useauthStore.getState().socket;
    const currentUser = useauthStore.getState().authUser;
    if (!socket || !selectedUser || !currentUser) return;

    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image || null,
    });
  },

  // 🔔 Listen for new messages in real time
  subscribeToMessages: () => {
    const socket = useauthStore.getState().socket;
    const { selectedUser } = get();
    if (!socket || !selectedUser) return;

    socket.off("newMessage"); // prevent duplicates
    socket.on("newMessage", (newMessage) => {
      const { messages } = get();

      // Show only if message belongs to current chat
      const isRelevant =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (isRelevant) {
        set({ messages: [...messages, newMessage] });
      }
    });

    // When sender gets confirmation
    socket.off("messageSent");
    socket.on("messageSent", (msg) => {
      set({ messages: [...get().messages, msg] });
    });

    // When delete updates all messages
    socket.off("allMessages");
    socket.on("allMessages", (updatedMessages) => {
      set({ messages: updatedMessages });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useauthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageSent");
    socket.off("allMessages");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // 👁️ Toggle message visibility
  visibleButton: async ({ id }) => {
    const { visible } = get();
    if (visible.includes(id)) {
      const newVisible = visible.filter((msgId) => msgId !== id);
      set({ visible: newVisible });
    } else {
      set({ visible: [...visible, id] });
    }
  },

  // ❌ Delete a message
  deleteMessage: async ({ id }) => {
    const socket = useauthStore.getState().socket;
    if (!socket) return;
    const currentUser = useauthStore.getState().authUser;
   
    socket.emit("deleteMessage", { messageId: id, userId: currentUser._id });
  },
}));
