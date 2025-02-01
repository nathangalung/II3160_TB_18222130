import { Hono } from 'hono'
import type { Context } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabase } from '../libs/supabase'
import { authMiddleware } from '../middlewares/auth'

interface Conversation {
  id: string;
  messages: Message[];
  participants: Participant[];
}

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  conversationId: string;
  senderId: string;
}

interface Participant {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string;
  };
}

const chatRoutes = new Hono()
chatRoutes.use('/*', authMiddleware)

const sendMessageSchema = z.object({
  content: z.string().min(1),
  receiverId: z.string().uuid()
})

// Get chat list
chatRoutes.get('/conversations', async (c: Context) => {
  try {
    const user = c.get('user')
    
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        created_at,
        updated_at,
        last_message,
        participants:conversation_participants(
          user:users(
            id,
            name,
            imageUrl,
            role
          )
        )
      `)
      .eq('participants.user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return c.json({ conversations: conversations || [] })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return c.json({ error: 'Failed to fetch conversations' }, 500)
  }
})

// Get messages for a conversation
chatRoutes.get('/:conversationId/messages', async (c) => {
  try {
    const user = c.get('user')
    const conversationId = c.req.param('conversationId')

    // Verify user is participant
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sender:users(
          id,
          name,
          imageUrl,
          role
        )
      `)
      .eq('conversation_id', c.req.param('conversationId'))
      .order('created_at', { ascending: true })

    if (error) throw error

    return c.json({ messages: messages || [] })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return c.json({ error: 'Failed to fetch messages' }, 500)
  }
})

// Send message
chatRoutes.post('/send', zValidator('json', sendMessageSchema), async (c) => {
  try {
    const user = c.get('user')
    const { content, receiverId } = await c.req.json()

    // Use database function to handle conversation creation and message sending
    const { error: sendError } = await supabase.rpc(
      'send_message_transaction',
      {
        p_sender_id: user.id,
        p_receiver_id: receiverId,
        p_content: content
      }
    )

    if (sendError) throw sendError

    return c.json({ 
      success: true,
      message: 'Message sent successfully'
    }, 201)

  } catch (error) {
    console.error('Error sending message:', error)
    return c.json({ error: 'Failed to send message' }, 500)
  }
})

export { chatRoutes }