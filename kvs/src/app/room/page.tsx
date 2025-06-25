// app/rooms/page.tsx
import { PrismaClient } from '../../../generated/prisma/client';
import React from 'react';

const prisma = new PrismaClient();

async function getRoomsWithStatus() {
  const now = new Date();

  return prisma.room.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
    include: {
      reservations: {
        where: {
          deletedAt: null,
          startTime: { lte: now },
          endTime: { gte: now }
        },
        select: { id: true }
      }
    }
  });
}

export default async function RoomPage() {
  const rooms = await getRoomsWithStatus();
  console.log("Gefundene Räume:", rooms);

  return (
    <div>
       <h1 className="text-4xl pb-4">Räume</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              width: '200px',
              textAlign: 'center',
              backgroundColor: room.reservations.length > 0 ? '#ffe5e5' : '#e5ffe5',
            }}
          >
            <strong>{room.name}</strong>
            <div>
              Status: {room.reservations.length > 0 ? 'Belegt' : 'Frei'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
