import { useState } from 'react'
import { Search, Star, Smile, Send } from 'lucide-react'
import Header from '../components/Header'
import ProfileImage from '../assets/Profile.png'
import Footer from '../components/Footer'

// Types
type UserRole = 'Customer' | 'Doctor' | 'Pharmacist'

interface Contact {
  id: string
  name: string
  role: UserRole
  avatar: string
  lastMessage?: string
  lastMessageTime?: string
  unread?: number
  online?: boolean
}

interface Message {
  id: string
  content: string
  timestamp: string
  sender: string
  receiver: string
}

// Sample Data
const contacts: Contact[] = [
  {
    id: '1',
    name: 'Ammi Watts',
    role: 'Doctor',
    avatar: ProfileImage,
    lastMessage: 'I will check it and get back to you soon',
    lastMessageTime: '04:45 PM',
    online: true
  },
  {
    id: '2',
    name: 'Jennifer Markus',
    role: 'Pharmacist',
    avatar: ProfileImage,
    lastMessage: 'Hey! Did you finish the Hi-Fi wireframes for flora app design?',
    lastMessageTime: '06:30 PM',
    unread: 3
  },
]

const messages: Message[] = [
  {
    id: '1',
    content: 'Oh, hello! All perfectly.',
    timestamp: '04:45 PM',
    sender: 'user',
    receiver: '1'
  },
  {
    id: '2',
    content: 'I will check it and get back to you soon',
    timestamp: '04:45 PM',
    sender: '1',
    receiver: 'user'
  },
]

// Components
interface ContactListProps {
  contacts: Contact[]
  selectedContact?: Contact
  onSelectContact: (contact: Contact) => void
}

function ContactList({ contacts, selectedContact, onSelectContact }: ContactListProps) {
    return (
        <div className="flex h-full w-full sm:w-80 flex-col border-r border-gray-200">
        <div className="p-3 sm:p-4">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm"
            />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
            <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`flex w-full items-start gap-3 p-3 sm:p-4 hover:bg-gray-50 ${
                selectedContact?.id === contact.id ? 'bg-gray-50' : ''
                }`}
            >
                <div className="relative flex-shrink-0">
                <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="h-10 w-10 rounded-full object-cover"
                />
                {contact.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
                </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{contact.name}</p>
                <time className="text-xs text-gray-500">
                    {contact.lastMessageTime}
                </time>
                </div>
                <div className="flex items-center gap-1">
                <span className="text-xs text-[#0EA5E9]">{contact.role}</span>
                {contact.unread && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA5E9] text-xs text-white">
                    {contact.unread}
                    </span>
                )}
                </div>
                {contact.lastMessage && (
                <p className="mt-1 truncate text-sm text-gray-500">
                    {contact.lastMessage}
                </p>
                )}
            </div>
            </button>
        ))}
        </div>
    </div>
    )
}

interface ChatHeaderProps {
  contact: Contact
}

function ChatHeader({ contact }: ChatHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          {contact.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>
        <div>
          <h2 className="font-medium text-gray-900">{contact.name}</h2>
          <p className="text-sm text-[#0EA5E9]">{contact.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full p-1 hover:bg-gray-100">
          <Star className="h-5 w-5 text-gray-600" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100">
          <Search className="h-5 w-5 text-gray-600" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100">
          <span className="sr-only">More options</span>
          <svg className="h-5 w-5 text-gray-600" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="4" cy="8" r="1" fill="currentColor" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface MessageListProps {
  messages: Message[]
  userId: string
}

function MessageList({ messages, userId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        {messages.map((message) => {
          const isUser = message.sender === userId
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-2 sm:px-4 ${
                  isUser
                    ? 'bg-[#0A0F2C] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <time className="mt-1 block text-right text-xs text-gray-400">
                  {message.timestamp}
                </time>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface MessageInputProps {
  onSendMessage: (content: string) => void
}

function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    onSendMessage(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <Smile className="h-5 w-5 text-gray-600" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here ..."
          className="flex-1 rounded-lg border-0 bg-transparent text-sm placeholder:text-gray-400 focus:ring-0"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="rounded-full p-2 text-[#0EA5E9] hover:bg-gray-100 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

// Main Page Component
export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const userId = 'user' // This would come from your auth system

  const handleSendMessage = (content: string) => {
    // Add message handling logic here
    console.log('Sending message:', content)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" userName="Bryan" />
      <main className="flex flex-1 overflow-hidden bg-white">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
        {selectedContact ? (
          <div className="flex flex-1 flex-col">
            <ChatHeader contact={selectedContact} />
            <MessageList messages={messages} userId={userId} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Select a contact to start chatting</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

