import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabase } from '../libs/supabase'
import { authMiddleware } from '../middlewares/auth'
import { createNotification } from '../utils/notification'

const appointmentRoutes = new Hono()
appointmentRoutes.use('/*', authMiddleware)

const createAppointmentSchema = z.object({
  date: z.string(),
  complaint: z.string(),
  medicalHistory: z.string(),
  doctorId: z.string()
})

const updateAppointmentSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'])
})

// Create appointment
appointmentRoutes.post('/', zValidator('json', createAppointmentSchema), async (c) => {
  try {
    const data = await c.req.json()
    const user = c.get('user')
    
    // Verify user is a patient
    if (user.role !== 'PATIENT') {
      return c.json({ error: 'Only patients can create appointments' }, 403)
    }

    // Get doctor info for notification
    const { data: doctor, error: doctorError } = await supabase
      .from('users')
      .select('name')
      .eq('id', data.doctorId)
      .eq('role', 'DOCTOR')
      .single()

    if (doctorError) {
      console.error('Doctor fetch error:', doctorError)
      return c.json({ error: 'Doctor not found' }, 404)
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert([{
        date: new Date(data.date),
        complaint: data.complaint,
        medicalHistory: data.medicalHistory,
        patientId: user.id,
        doctorId: data.doctorId,
        status: 'PENDING'
      }])
      .select()
      .single()

      if (appointmentError) {
        console.error('Appointment creation error:', appointmentError)
        throw appointmentError
      }
  
      // Send notification
      await createNotification(
        data.doctorId,
        'APPOINTMENT',
        'New Appointment Request',
        `You have a new appointment request from ${user.name}`
      )
  
      return c.json({ appointment }, 201)
    } catch (error) {
      console.error('Appointment creation failed:', error)
      return c.json({ 
        error: 'Failed to create appointment',
        details: error.message 
      }, 500)
    }
  })

// Get user appointments
appointmentRoutes.get('/', async (c) => {
  try {
    const user = c.get('user')
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:users!doctorId(*),
        patient:users!patientId(*),
        prescription(*)
      `)
      .eq(user.role === 'DOCTOR' ? 'doctorId' : 'patientId', user.id)
      .order('date', { ascending: true })

    if (error) throw error
    return c.json({ appointments })
  } catch (error) {
    return c.json({ error: 'Failed to fetch appointments' }, 500)
  }
})

// Get appointment by ID
appointmentRoutes.get('/:id', async (c) => {
  try {
    const user = c.get('user')
    const id = c.req.param('id')

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:users!doctorId(*),
        patient:users!patientId(*),
        prescription(*)
      `)
      .eq('id', id)
      .single()

    if (error || !appointment) {
      return c.json({ error: 'Appointment not found' }, 404)
    }

    // Check access rights
    if (user.role === 'PATIENT' && appointment.patientId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    if (user.role === 'DOCTOR' && appointment.doctorId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    return c.json({ appointment })
  } catch (error) {
    return c.json({ error: 'Failed to fetch appointment' }, 500)
  }
})

// Update appointment status
appointmentRoutes.patch('/:id', zValidator('json', updateAppointmentSchema), async (c) => {
  try {
    const user = c.get('user')
    const id = c.req.param('id')
    const { status } = await c.req.json()

    if (user.role !== 'DOCTOR') {
      return c.json({ error: 'Only doctors can update appointment status' }, 403)
    }
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .eq('doctorId', user.id)
      .select(`
        *,
        patient:users!patientId(*),
        doctor:users!doctorId(name)
      `)
      .single()

    if (error) throw error

    // Send appropriate notifications
    if (status === 'APPROVED') {
      await createNotification(
        appointment.patientId,
        'APPOINTMENT',
        'Appointment Approved',
        `Your appointment for ${new Date(appointment.date).toLocaleDateString()} with Dr. ${appointment.doctor.name} has been approved`
      )
    } else if (status === 'CANCELLED') {
      await createNotification(
        appointment.patientId,
        'APPOINTMENT',
        'Appointment Cancelled',
        `Your appointment for ${new Date(appointment.date).toLocaleDateString()} has been cancelled`
      )
    }

    return c.json({ appointment })
  } catch (error) {
    return c.json({ error: 'Failed to update appointment' }, 500)
  }
})

// Get doctor schedule
appointmentRoutes.get('/doctor/schedule', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'DOCTOR') {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    const { data: schedule, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users!patientId(*)
      `)
      .eq('doctorId', user.id)
      .order('date', { ascending: true })

    if (error) throw error
    return c.json({ schedule })
  } catch (error) {
    return c.json({ error: 'Failed to fetch schedule' }, 500)
  }
})

export { appointmentRoutes }