'use client';

import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventContentArg, DatesSetArg } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';

// ---- Types ----

interface ExtendedEventProps {
  courseId?: string;
}

type EventType = {
  id: string;
  title?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  mainTrainer?: string;
  coTrainers?: string[];
  display?: string;
  color?: string;
  extendedProps?: ExtendedEventProps;
};

type CalendarProps = {
  events: EventType[];
  holidayDates: Set<string>;
};

// ---- Custom Event Rendering ----

function renderEventContent(eventInfo: EventContentArg) {
  const isHoliday = eventInfo.event.id.startsWith('holiday-');
  const isCourseDay = eventInfo.event.id.startsWith('courseDay-');

  // Render for courseDay events in Woche/Tag (timeGrid) views
  if (isCourseDay && eventInfo.view.type.startsWith('timeGrid')) {
    const start = eventInfo.event.start;
    const hour = start
      ? start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      : '';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s',
          color: '#134e21',
          fontWeight: 500,
          textShadow: '0 2px 8px #fff, 0 0px 2px #fff, 0 0 2px #fff',
        }}
        className="fc-course-hoverable fc-course-timegrid"
        title="Zum Kurs springen"
        onClick={() => {
          const courseId = eventInfo.event.extendedProps?.courseId;
          if (courseId) {
            window.location.href = `/course/${courseId}`;
          }
        }}
      >
        <span style={{ fontWeight: 700 }}>{hour}</span>
        <span>{eventInfo.event.title}</span>
      </div>
    );
  }

  // Render for all other events (month view, holidays, etc.)
  return (
    <div
      className={
        isCourseDay
          ? 'fc-course-hoverable'
          : isHoliday
          ? 'fc-holiday-hoverable'
          : ''
      }
      title={
        isCourseDay
          ? 'Zum Kurs springen'
          : isHoliday
          ? 'Zu den Feiertagen'
          : undefined
      }
      onClick={() => {
        if (isCourseDay) {
          const courseId = eventInfo.event.extendedProps?.courseId;
          if (courseId) {
            window.location.href = `/course/${courseId}`;
          }
        }
        if (isHoliday) {
          window.location.href = '/settings/globalHolidays';
        }
      }}
      style={{
        color: isHoliday ? 'white' : '#1e3a8a',
        background: isCourseDay
          ? '#f1f5f9'
          : isHoliday
          ? '#ef4444'
          : undefined,
        borderRadius: isCourseDay || isHoliday ? '0.3rem' : undefined,
        padding: isCourseDay || isHoliday ? '0.08rem 0.3rem' : undefined,
        fontWeight: isCourseDay ? 500 : isHoliday ? 500 : 400,
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        transition: 'background 0.2s, color 0.2s',
        fontSize: '0.98em',
      }}
    >
      <b>{eventInfo.timeText}</b> {eventInfo.event.title}
    </div>
  );
}

// ---- Main Calendar Component ----

const Calendar: React.FC<CalendarProps> = ({ events, holidayDates }) => {
  // State for background events, modal, and user-created events
  const [backgroundEvents, setBackgroundEvents] = useState<EventType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [userEvents, setUserEvents] = useState<EventType[]>([]);

  // Generate background events for morning and evening slots for each visible day
  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    const bgEvents: EventType[] = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      bgEvents.push({
        id: `bg-morning-${yyyy}${mm}${dd}`,
        start: `${yyyy}-${mm}-${dd}T06:00:00`,
        end: `${yyyy}-${mm}-${dd}T13:00:00`,
        display: 'background',
        color: '#f4f4f5'
      });
      bgEvents.push({
        id: `bg-evening-${yyyy}${mm}${dd}`,
        start: `${yyyy}-${mm}-${dd}T18:00:00`,
        end: `${yyyy}-${mm}-${dd}T24:00:00`,
        display: 'background',
        color: '#f4f4f5'
      });
    }
    setBackgroundEvents(bgEvents);
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      {/* Custom styles for event hover and background */}
      <style>
        {`
          .fc-course-hoverable {
            transition: background 0.2s, color 0.2s;
          }
          .fc-course-hoverable:hover:not(.fc-course-timegrid) {
            background: #e0e7ff !important;
            color: #1e3a8a !important;
            cursor: pointer;
            font-weight: 700 !important;
          }
          .fc-course-timegrid:hover {
            background: #bbf7d0 !important;
            color: #134e21 !important;
            cursor: pointer;
            text-shadow: 0 4px 12px #fff, 0 0px 2px #fff, 0 0 2px #fff !important;
            font-weight: 700 !important;
          }
          .fc-holiday-hoverable {
            transition: background 0.2s, color 0.2s;
          }
          .fc-holiday-hoverable:hover {
            background: #2563eb !important;
            color: #fff !important;
            cursor: pointer;
          }
        `}
      </style>

      {/* Modal for adding a new user event */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">Neuer Termin</h2>
            <input
              className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-100"
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

      {/* Main calendar */}
      <div className="p-4 bg-white rounded-2xl shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          slotDuration='00:30:00'
          slotMinTime='06:00:00'
          slotMaxTime='24:00:00'
          locale={deLocale}
          events={[...events, ...userEvents, ...backgroundEvents]}
          selectable
          editable
          height={1100}
          eventContent={renderEventContent}
          eventClassNames={arg => {
            if (arg.event.id.startsWith('holiday-')) {
              return ['bg-red-200', 'text-white', 'border-none', 'fc-holiday-hoverable'];
            }
            if (arg.event.id.startsWith('courseDay-')) {
              if (arg.view.type.startsWith('timeGrid')) {
                return ['fc-course-hoverable', 'fc-course-timegrid'];
              }
              return ['fc-course-hoverable'];
            }
            return [];
          }}
          dayCellClassNames={arg => {
            // Highlight holiday days in the month view
            const dateStr = arg.date.toLocaleDateString('sv-SE'); // "YYYY-MM-DD"
            if (holidayDates.has(dateStr)) {
              return ['bg-red-100'];
            }
            return [];
          }}
          datesSet={handleDatesSet}
          dateClick={info => {
            setSelectedDate(info.dateStr);
            setShowModal(true);
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;