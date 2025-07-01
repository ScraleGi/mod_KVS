'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

type EventType = {
  id: string;
  title: string;
  start: string;
  end?: string;
  mainTrainer: string;
  coTrainers: string[];
};


// highlighting Holidays 
function renderEventContent(eventInfo: any) {
  const isHoliday = eventInfo.event.id.startsWith('holiday-');
  return (
    <div style={{ color: isHoliday ? 'red' : 'black' }}>
      <b>{eventInfo.timeText}</b> {eventInfo.event.title}
    </div>
  );
}

const Calendar: React.FC<{ events: EventType[] }> = ({ events }) => (
  <div className="p-4 bg-white rounded-2xl shadow-lg">
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      slotDuration='00:30:00' // ← Optional: Zeitslots alle 30 Minuten
      slotMinTime='06:00:00'   // ← Optional: Kalender startet um 8 Uhr
      slotMaxTime='24:00:00'   // ← Optional: Kalender endet um 18 Uhr
      allDaySlot={false}          // ← Optional: All-Day-Zeile ausblenden
      events={events}
      selectable
      editable
      height= {1000}
      eventContent={renderEventContent}
    />
  </div>

);

export default Calendar;