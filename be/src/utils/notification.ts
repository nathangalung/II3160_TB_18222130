import { supabase } from '../libs/supabase'

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        userId,
        type,
        title,
        message
      }])
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

// Notification templates
export const NotificationTemplates = {
  APPOINTMENT_CREATED: (doctorName: string) => ({
    type: 'APPOINTMENT',
    title: 'New Appointment Request',
    message: `You have a new appointment request from Dr. ${doctorName}`
  }),

  APPOINTMENT_APPROVED: (date: string) => ({
    type: 'APPOINTMENT',
    title: 'Appointment Approved',
    message: `Your appointment for ${date} has been approved`
  }),

  PRESCRIPTION_CREATED: (doctorName: string) => ({
    type: 'PRESCRIPTION',
    title: 'New Prescription',
    message: `Dr. ${doctorName} has created a new prescription for you`
  }),

  CHAT_MESSAGE: (senderName: string) => ({
    type: 'CHAT',
    title: 'New Message',
    message: `You have a new message from ${senderName}`
  })
}