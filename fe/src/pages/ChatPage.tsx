import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Send } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DefaultAvatar from '../assets/Profile.png'
import { api } from '../utils/api'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  isRead: boolean
}

interface Conversation {
  id: string
  participants: {
    user: {
      id: string
      name: string
      imageUrl?: string
      role: string
    }
  }[]
  lastMessage?: string
  updatedAt?: string
  unreadCount?: number
}

interface ContactListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  currentUserId: string
}

// interface ChatHeaderProps {
//   conversation: Conversation
//   currentUserId: string
// }

// interface MessageListProps {
//   messages: Message[]
//   currentUserId: string
// }

// interface MessageInputProps {
//   onSendMessage: (content: string) => void
// }

type ApiResponse<T> = {
  data?: T
  error?: string
}

const ContactList = ({ conversations, selectedConversation, onSelectConversation, currentUserId }: ContactListProps) => (
  <div className="w-80 border-r border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
    <div className="overflow-y-auto">
      {conversations.map(conversation => {
        const otherParticipant = conversation.participants.find(
          p => p.user.id !== currentUserId
        )?.user
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={otherParticipant?.imageUrl || DefaultAvatar}
                alt={otherParticipant?.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{otherParticipant?.name}</p>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 capitalize">{otherParticipant?.role.toLowerCase()}</p>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

// const ChatHeader = ({ conversation, currentUserId }: ChatHeaderProps) => {
//   const otherParticipant = conversation.participants.find(
//     p => p.user.id !== currentUserId
//   )?.user
  
//   return (
//     <div className="border-b border-gray-200 p-4">
//       <div className="flex items-center gap-3">
//         <img
//           src={otherParticipant?.imageUrl || DefaultAvatar}
//           alt={otherParticipant?.name}
//           className="h-10 w-10 rounded-full"
//         />
//         <div>
//           <h2 className="font-medium">{otherParticipant?.name}</h2>
//           <p className="text-sm text-gray-500">{otherParticipant?.role}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// const MessageList = ({ messages, currentUserId }: MessageListProps) => (
//   <div className="flex-1 overflow-y-auto p-4">
//     <div className="space-y-4">
//       {messages.map(message => (
//         <div
//           key={message.id}
//           className={`flex ${
//             message.senderId === currentUserId ? 'justify-end' : 'justify-start'
//           }`}
//         >
//           <div
//             className={`rounded-lg px-4 py-2 max-w-[70%] ${
//               message.senderId === currentUserId
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100'
//             }`}
//           >
//             <p className="text-sm">{message.content}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )

// const MessageInput = ({ onSendMessage }: MessageInputProps) => {
//   const [message, setMessage] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!message.trim()) return
//     onSendMessage(message)
//     setMessage('')
//   }

//   return (
//     <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//         >
//           <Send className="h-4 w-4" />
//         </button>
//       </div>
//     </form>
//   )
// }

const sampleConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        user: {
          id: '1',
          name: 'dr. Kasyfil',
          imageUrl: DefaultAvatar,
          role: 'DOCTOR'
        }
      }
    ],
    lastMessage: 'Hello, how can I help you?',
    updatedAt: new Date().toISOString(),
    unreadCount: 2
  },
  {
    id: '2',
    participants: [
      {
        user: {
          id: '2',
          name: 'Bryan P. Hutagalung',
          imageUrl: DefaultAvatar,
          role: 'PATIENT'
        }
      }
    ],
    lastMessage: 'Thank you, doctor',
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  }
]

const sampleMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Hello, how can I help you?',
      senderId: '1',
      createdAt: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      content: 'I have a headache',
      senderId: '2',
      createdAt: new Date().toISOString(),
      isRead: true
    }
  ],
  '2': [
    {
      id: '3',
      content: 'Thank you for the prescription',
      senderId: '2',
      createdAt: new Date().toISOString(),
      isRead: true
    },
    {
      id: '4',
      content: "You're welcome, take care!",
      senderId: '1',
      createdAt: new Date().toISOString(),
      isRead: true
    }
  ]
}

export default function ChatPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!user?.id || !localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    const fetchConversations = async () => {
      setLoading(true)
      try {
        const response = await api.chat.getConversations() as ApiResponse<{ conversations: Conversation[] }>
        if (response.error) throw new Error(response.error)
        
        setConversations(response.data?.conversations?.length ? response.data.conversations : sampleConversations)
      } catch (err) {
        console.error('Failed to fetch conversations:', err)
        setConversations(sampleConversations)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user?.id, navigate])

  useEffect(() => {
    if (!currentConversation?.id) return
    
    const fetchMessages = async () => {
      try {
        const response = await api.chat.getMessages(currentConversation.id) as ApiResponse<{ messages: Message[] }>
        if (response.error) throw new Error(response.error)
        
        setMessages(response.data?.messages?.length ? response.data.messages : sampleMessages[currentConversation.id] || [])
        
        if (currentConversation?.unreadCount && currentConversation.unreadCount > 0) {
          setConversations(prev =>
            prev.map(conv =>
              conv.id === currentConversation.id
                ? { ...conv, unreadCount: 0 }
                : conv
            )
          )
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err)
        setMessages(sampleMessages[currentConversation.id] || [])
      }
    }

    fetchMessages()
  }, [currentConversation?.id])

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || !content.trim()) return

    try {
      const receiver = currentConversation.participants.find(
        p => p.user.id !== user.id
      )

      if (!receiver) return

      const response = await api.chat.sendMessage({
        content,
        receiverId: receiver.user.id
      })
      
      if (response.error) throw new Error(response.error)

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content,
        senderId: user.id,
        createdAt: new Date().toISOString(),
        isRead: false
      }])
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send message')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" userName={user.name} />
      <main className="flex flex-1 overflow-hidden">
        <ContactList
          conversations={conversations}
          selectedConversation={currentConversation}
          onSelectConversation={setCurrentConversation}
          currentUserId={user.id}
        />
        {currentConversation ? (
          <div className="flex flex-1 flex-col">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentConversation.participants.find(p => p.user.id !== user.id)?.user.imageUrl || DefaultAvatar}
                  alt={currentConversation.participants.find(p => p.user.id !== user.id)?.user.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h2 className="font-medium">
                    {currentConversation.participants.find(p => p.user.id !== user.id)?.user.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentConversation.participants.find(p => p.user.id !== user.id)?.user.role}
                  </p>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[70%] ${
                      message.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4">
              <form onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputMessage)
                setInputMessage('')
              }}>
                <div className="flex gap-2">
                  <input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}