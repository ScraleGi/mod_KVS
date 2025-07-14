import Link from 'next/link';
import { db } from '@/lib/db';
import { sanitize } from '@/lib/sanitize';

// Helper function to get rooms with their current reservation status
async function getRoomsWithStatus() {
  const now = new Date();

  return db.room.findMany({
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
  try {
    const roomsData = await getRoomsWithStatus();
    const rooms = sanitize(roomsData);
    
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Rooms
            </h1>
            <Link
              href="/room/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Add New Room
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room) => {
              const isOccupied = room.reservations.length > 0;
              
              return (
                <Link 
                  key={room.id} 
                  href={`/room/${room.id}`}
                  className={`
                    block border rounded-lg p-4 transition hover:shadow-md
                    ${isOccupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}
                  `}
                >
                  <div className="font-semibold text-lg mb-2">{room.name}</div>
                  <div className={`text-sm ${isOccupied ? 'text-red-700' : 'text-green-700'}`}>
                    Status: {isOccupied ? 'Occupied' : 'Available'}
                  </div>
                </Link>
              );
            })}
          </div>
          
          {rooms.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No rooms found. Add a new room to get started.
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load rooms:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md bg-white rounded-lg shadow border border-gray-100 p-6">
          <div className="text-lg text-red-500 mb-4">Error loading rooms</div>
          <p className="text-gray-600 mb-4">
            There was a problem fetching the room data. Please try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}