import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { IoIosSend } from "react-icons/io";
import {
  fetchContacts,
  fetchHistory,
  postMessage,
  setActivePartner,
  receiveMessage,
  clearChatState,
} from "../features/ChatSlice";
import Loading from "../components/Loading";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { contacts, messages, activePartner, contactsStatus, historyStatus } = useSelector(
    (s) => s.chat
  );

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Initialize Socket.io Connection
  useEffect(() => {
    // Dynamic URL matching axios setup
    const SOCKET_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://orgsync-saas-tenant-app.onrender.com";

    // Create socket connection
    socketRef.current = io(SOCKET_URL);

    // Join private room on connect
    if (user && user.id) {
      socketRef.current.emit("join_user_room", user.id);
    }

    // Listen for real-time messages
    socketRef.current.on("receive_message", (message) => {
      dispatch(receiveMessage(message));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      dispatch(clearChatState());
    };
  }, [user, dispatch]);

  // Load Contacts list
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Load Message History when active partner changes
  useEffect(() => {
    if (activePartner) {
      dispatch(fetchHistory(activePartner._id));
    }
  }, [activePartner, dispatch]);

  // Auto Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartner) return;

    dispatch(
      postMessage({
        receiverId: activePartner._id,
        text: text.trim(),
      })
    );
    setText("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="text-white min-h-[calc(100vh-160px)] flex m-3 shadow-[0_0_20px_rgba(0,0,0,0.7)] bg-[#0C1A2B] rounded-xl overflow-hidden border border-gray-800">
      {/* LEFT PANEL: CONTACTS SIDEBAR */}
      <div className="w-full md:w-80 border-r border-gray-800 flex flex-col bg-[#0A1624]">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-[#B6FF3B] mb-3">Chats</h2>
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0C1A2B] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-gray-800 px-3 py-2 rounded-lg outline-none text-sm text-gray-200 placeholder-gray-500 focus:border-[#B6FF3B] transition"
          />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {contactsStatus === "pending" ? (
            <div className="flex justify-center mt-10">
              <Loading />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isActive = activePartner?._id === contact._id;
              return (
                <div
                  key={contact._id}
                  onClick={() => dispatch(setActivePartner(contact))}
                  className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#B6FF3B] text-[#0C1A2B] shadow-md font-medium"
                      : "hover:bg-[#162a45] text-gray-300"
                  }`}
                >
                  {/* Avatar */}
                  <span
                    className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${
                      isActive ? "bg-[#0C1A2B] text-[#B6FF3B]" : "bg-[#B6FF3B] text-[#0C1A2B]"
                    }`}
                  >
                    {contact.name.charAt(0).toUpperCase()}
                  </span>

                  {/* Info */}
                  <div className="overflow-hidden flex-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm truncate font-medium">{contact.name}</h4>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        isActive ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {contact.role === "admin" ? "Organization Admin" : "Team Member"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-[#0C1A2B]">
        {activePartner ? (
          <>
            {/* Chat Window Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0A1624]">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-[#B6FF3B] text-[#0C1A2B] flex items-center justify-center font-bold">
                  {activePartner.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">
                    {activePartner.name}
                  </h3>
                  <span className="text-xs text-gray-400 capitalize">
                    {activePartner.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {historyStatus === "pending" ? (
                <div className="flex justify-center items-center h-full">
                  <Loading />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                  <p className="text-sm">No messages yet.</p>
                  <p className="text-xs text-gray-600">Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === user.id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow-sm ${
                          isOwn
                            ? "bg-[#B6FF3B] text-[#0C1A2B] rounded-tr-none"
                            : "bg-[#162a45] text-white rounded-tl-none"
                        }`}
                      >
                        <p className="break-words leading-relaxed">{msg.text}</p>
                        <span
                          className={`block text-[10px] text-right mt-1 font-light ${
                            isOwn ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-800 bg-[#0A1624] flex gap-3 items-center"
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow bg-[#0C1A2B] border border-gray-800 px-4 py-3 rounded-xl outline-none text-sm text-gray-200 placeholder-gray-500 focus:border-[#B6FF3B] transition"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="bg-[#B6FF3B] text-[#0C1A2B] p-3 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition duration-200"
              >
                <IoIosSend className="text-xl" />
              </button>
            </form>
          </>
        ) : (
          /* Splash screen when no partner selected */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
            <div className="bg-[#0A1624] p-8 rounded-2xl border border-gray-800 shadow-md text-center max-w-sm">
              <span className="text-5xl mb-4 block">💬</span>
              <h3 className="text-white font-medium mb-1">Your Organization Inbox</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Choose a contact from the sidebar list to start chatting with your Organization Admins or Team Members.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
