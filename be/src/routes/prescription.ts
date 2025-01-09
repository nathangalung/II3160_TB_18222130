import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabase } from '../libs/supabase'
import { authMiddleware } from '../middlewares/auth'
import { createNotification } from '../utils/notification'

const prescriptionRoutes = new Hono()
prescriptionRoutes.use('/*', authMiddleware)

const createPrescriptionSchema = z.object({
  appointmentId: z.string(),
  medicines: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().optional()
  }))
})

const updatePrescriptionSchema = z.object({
  status: z.enum(['PENDING', 'READY', 'COMPLETED', 'CANCELLED'])
})

// Create prescription (Doctor only)
prescriptionRoutes.post('/', zValidator('json', createPrescriptionSchema), async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'DOCTOR') {
      return c.json({ error: 'Only doctors can create prescriptions' }, 403)
    }

    const data = await c.req.json()
    
    // Get appointment and patient info
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('patientId, patient:users!patientId(name)')
      .eq('id', data.appointmentId)
      .eq('doctorId', user.id)
      .single()

    if (appointmentError || !appointment) {
      return c.json({ error: 'Invalid appointment' }, 400)
    }

    // Create prescription with medicines in a transaction
    const { data: prescription, error } = await supabase.rpc('create_prescription', {
      appointment_id: data.appointmentId,
      patient_id: appointment.patientId,
      doctor_id: user.id,
      medicines: data.medicines
    })

    if (error) throw error

    // Notify patient
    await createNotification(
      appointment.patientId,
      'PRESCRIPTION',
      'New Prescription',
      `Dr. ${user.name} has created a new prescription for you`
    )

    return c.json({ prescription }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create prescription' }, 500)
  }
})

// Get prescriptions based on user role
prescriptionRoutes.get('/', async (c) => {
  try {
    const user = c.get('user')
    let query = supabase
      .from('prescriptions')
      .select(`
        *,
        medicines (*),
        doctor:users!doctorId(id, name, email),
        patient:users!patientId(id, name, email),
        appointment(*)
      `)

    // Filter based on user role
    switch (user.role) {
      case 'PATIENT':
        query = query.eq('patientId', user.id)
        break
      case 'DOCTOR':
        query = query.eq('doctorId', user.id)
        break
      case 'PHARMACIST':
        // Pharmacists can see all prescriptions
        break
      default:
        return c.json({ error: 'Invalid user role' }, 403)
    }

    const { data: prescriptions, error } = await query
      .order('createdAt', { ascending: false })

    if (error) throw error
    return c.json({ prescriptions })
  } catch (error) {
    return c.json({ error: 'Failed to fetch prescriptions' }, 500)
  }
})

// Get prescription by ID
prescriptionRoutes.get('/:id', async (c) => {
  try {
    const user = c.get('user')
    const id = c.req.param('id')

    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        medicines (*),
        doctor:users!doctorId(*),
        patient:users!patientId(*),
        appointment(*)
      `)
      .eq('id', id)
      .single()

    if (error || !prescription) {
      return c.json({ error: 'Prescription not found' }, 404)
    }

    // Check access rights
    if (user.role === 'PATIENT' && prescription.patientId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    if (user.role === 'DOCTOR' && prescription.doctorId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    return c.json({ prescription })
  } catch (error) {
    return c.json({ error: 'Failed to fetch prescription' }, 500)
  }
})

// Update prescription status (Pharmacist only)
prescriptionRoutes.patch('/:id', zValidator('json', updatePrescriptionSchema), async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'PHARMACIST') {
      return c.json({ error: 'Only pharmacists can update prescription status' }, 403)
    }

    const id = c.req.param('id')
    const { status } = await c.req.json()
    
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        patient:users!patientId(*)
      `)
      .single()

    if (error) throw error

    // Send notification when prescription is ready
    if (status === 'READY') {
      await createNotification(
        prescription.patientId,
        'PRESCRIPTION',
        'Prescription Ready',
        'Your prescription is ready for pickup'
      )
    }

    return c.json({ prescription })
  } catch (error) {
    return c.json({ error: 'Failed to update prescription' }, 500)
  }
})

// Add medicine to prescription (Doctor only)
prescriptionRoutes.post('/:id/medicines', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'DOCTOR') {
      return c.json({ error: 'Only doctors can add medicines' }, 403)
    }

    const id = c.req.param('id')
    const data = await c.req.json()

    const { error: prescriptionError } = await supabase
      .from('prescriptions')
      .select()
      .eq('id', id)
      .eq('doctorId', user.id)
      .single()

    if (prescriptionError) {
      return c.json({ error: 'Prescription not found or unauthorized' }, 404)
    }

    const { data: medicine, error } = await supabase
      .from('medicines')
      .insert({
        ...data,
        prescriptionId: id
      })
      .select()
      .single()

    if (error) throw error
    return c.json({ medicine }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to add medicine' }, 500)
  }
})

// Remove medicine from prescription (Doctor only)
prescriptionRoutes.delete('/:id/medicines/:medicineId', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'DOCTOR') {
      return c.json({ error: 'Only doctors can remove medicines' }, 403)
    }

    const { id, medicineId } = c.req.param()

    const { error: prescriptionError } = await supabase
      .from('prescriptions')
      .select()
      .eq('id', id)
      .eq('doctorId', user.id)
      .single()

    if (prescriptionError) {
      return c.json({ error: 'Prescription not found or unauthorized' }, 404)
    }

    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', medicineId)
      .eq('prescriptionId', id)

    if (error) throw error
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to remove medicine' }, 500)
  }
})

export { prescriptionRoutes }