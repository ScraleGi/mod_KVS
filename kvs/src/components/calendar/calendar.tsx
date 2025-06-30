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

const Calendar: React.FC<{ events: EventType[] }> = ({ events }) => (
  <div className="p-4 bg-white rounded-2xl shadow-lg">
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      selectable
      editable
      height= {900}
    />
  </div>
);

export default Calendar;