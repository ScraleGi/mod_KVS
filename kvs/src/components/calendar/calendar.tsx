'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

type EventType = {
  id: string;
  title: string;
  start: string;
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
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      selectable
      editable
      height= {900}
      eventContent={renderEventContent}
    />
  </div>
);

export default Calendar;