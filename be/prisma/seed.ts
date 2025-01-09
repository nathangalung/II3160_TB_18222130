import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const doctor = await prisma.user.create({
    data: {
      name: 'dr. Kasyfil',
      email: 'kasyfil@medico.com',
      password: '$2a$10$K7L8c1B7mB8PWv.CAhVC9O2tF5HA5Zp5ThM3kcYd4AIHj8Y3S1oD6', // "password123"
      role: 'DOCTOR'
    }
  })

  const patient = await prisma.user.create({
    data: {
      name: 'Bryan P. Hutagalung',
      email: 'bryan@example.com',
      password: '$2a$10$K7L8c1B7mB8PWv.CAhVC9O2tF5HA5Zp5ThM3kcYd4AIHj8Y3S1oD6',
      role: 'PATIENT'
    }
  })

  // Create appointments
  const appointment = await prisma.appointment.create({
    data: {
      date: new Date('2024-03-15'),
      complaint: 'Sakit tenggorokan',
      medicalHistory: 'Tidak ada riwayat penyakit serius',
      status: 'PENDING',
      payment: 150000,
      patientId: patient.id,
      doctorId: doctor.id
    }
  })

  // Create prescription
  await prisma.prescription.create({
    data: {
      appointmentId: appointment.id,
      patientId: patient.id,
      doctorId: doctor.id,
      status: 'PENDING',
      medicines: {
        create: [
          {
            name: 'Ambroxol',
            description: 'Obat batuk 3x1',
            imageUrl: '/medicines/ambroxol.jpg'
          }
        ]
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })