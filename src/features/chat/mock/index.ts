import { Conversation } from "../types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "chat-sri",
    participant: {
      id: "user-2",
      name: "Ibu Sri",
      handle: "ibusri",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
      role: "merchant"
    },
    isPinned: false,
    isTyping: false,
    messages: [
      {
        id: "msg-sri-1",
        senderId: "user-2",
        text: "Halo Budi! Spicy Tempeh chips kami baru saja matang. Ini buatan tangan segar dari Bandung.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true
      },
      {
        id: "msg-sri-2",
        senderId: "user-2",
        text: "Mau pesan sekotak untuk dicoba? Kamu bisa beli langsung lewat kartu produk di bawah ini:",
        timestamp: new Date(Date.now() - 3.9 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        productRef: {
          id: "prod-2",
          title: "Spicy Tempeh Crisps (Box)",
          price: 15000,
          imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=200&auto=format&fit=crop&q=60",
          stock: 25
        }
      },
      {
        id: "msg-budi-1",
        senderId: "user-1",
        text: "Wah, kelihatannya enak sekali Bu Sri! Sebentar saya cek dulu.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true
      }
    ]
  },
  {
    id: "chat-andi",
    participant: {
      id: "user-3",
      name: "Andi Wijaya",
      handle: "andi",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
      role: "creator"
    },
    isPinned: false,
    isTyping: false,
    messages: [
      {
        id: "msg-andi-1",
        senderId: "user-3",
        text: "Hi Budi, apa kabar? Saya baru saja merilis set ilustrasi vektor warm cream bertema budaya Indonesia.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true
      },
      {
        id: "msg-andi-2",
        senderId: "user-3",
        text: "Jika kamu sedang mendesain platform NusaHub, aset-aset ini sangat cocok untuk tema hangat super-app kita.",
        timestamp: new Date(Date.now() - 23.8 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        productRef: {
          id: "prod-1",
          title: "Warm Cream Vectors Set",
          price: 25000,
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60",
          stock: 99
        }
      }
    ]
  }
];
