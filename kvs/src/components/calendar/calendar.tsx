'use client';

import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

type EventType = {
  id: string;
  title?: string; // optional, damit Background-Events kein title brauchen
  start: string;
  end?: string;
  allDay?: boolean;
  mainTrainer?: string;
  coTrainers?: string[];
  display?: string;
  color?: string;
};


// Hilfsfunktion: Gibt ein Set aller Feiertagsdaten (YYYY-MM-DD) zurück
function getHolidayDates(events: EventType[]): Set<string> {
  return new Set(
    events
      .filter(e => e.id.startsWith('holiday-'))
      .map(e => e.start.slice(0, 10))
  );
}

// highlighting Holidays 
function renderEventContent(eventInfo: any) {
  const isHoliday = eventInfo.event.id.startsWith('holiday-');
  return (
    <div style={{ color: isHoliday ? 'white' : 'black' }}>
      <b>{eventInfo.timeText}</b> {eventInfo.event.title}
    </div>
  );
}

const Calendar: React.FC<{ events: EventType[] }> = ({ events }) => {
  const holidayDates = getHolidayDates(events);
  const [backgroundEvents, setBackgroundEvents] = useState<EventType[]>([]);
  //clickable for set new date
  const [showModal, setShowModal] = useState(false); //Modal offen
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Gewähltes Datum
  const [newEventTitle, setNewEventTitle] = useState(''); // Titel für neuen Termin
  const [userEvents, setUserEvents] = useState<EventType[]>([]); // User-Termine

  // Callback, wenn sich der sichtbare Bereich ändert
  const handleDatesSet = useCallback((arg: any) => {
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    const bgEvents: EventType[] = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      // 6-13 Uhr
      bgEvents.push({
        id: `bg-morning-${yyyy}${mm}${dd}`,
        start: `${yyyy}-${mm}-${dd}T06:00:00`,
        end: `${yyyy}-${mm}-${dd}T13:00:00`,
        display: 'background',
        color: '#d1d5db'
      });
      // 17-23 Uhr
      bgEvents.push({
        id: `bg-evening-${yyyy}${mm}${dd}`,
        start: `${yyyy}-${mm}-${dd}T18:00:00`,
        end: `${yyyy}-${mm}-${dd}T24:00:00`,
        display: 'background',
        color: '#d1d5db'
      });

    }
    setBackgroundEvents(bgEvents);
  }, []);

  return (
    // click in calendar opens new window for setting date 
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      {/* Modal für neuen Termin */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">Neuer Termin</h2>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Titel"
              value={newEventTitle}
              onChange={e => setNewEventTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (newEventTitle && selectedDate) {
                    setUserEvents([
                      ...userEvents,
                      {
                        id: `user-${Date.now()}`,
                        title: newEventTitle,
                        start: selectedDate,
                        allDay: true
                      }
                    ]);
                    setShowModal(false);
                    setNewEventTitle('');
                  }
                }}
              >
                Speichern
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

        
      <div className="p-4 bg-white rounded-2xl shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            // left: Navigation buttons (prev, next, today)
            left: 'prev,next today',
            // center: Title (current month/week/day)
            center: 'title',
            // right: View selection buttons (month, week, day)
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}

          slotDuration='00:30:00'
          slotMinTime='06:00:00'
          slotMaxTime='24:00:00'
          events={[...events, ...userEvents, ...backgroundEvents]}
          selectable
          editable
          height={1100}
          eventContent={renderEventContent}
          eventClassNames={(arg) => {
            if (arg.event.id.startsWith('holiday-')) {
              return ['bg-red-200', 'text-white', 'border-none'];
            }
            return [];
          }}

          dayCellClassNames={arg => {
            const dateStr = arg.date.toISOString().slice(0, 10);
            if (holidayDates.has(dateStr)) {
              return ['bg-red-100'];
            }
            return [];
          }}
          datesSet={handleDatesSet}

          dateClick={(info) => {
            setSelectedDate(info.dateStr);
            setShowModal(true);
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;