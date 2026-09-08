import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Button from '../common/Button';

export default function EventCard({ event, onRegister }) {
  return (
    <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span className="badge badge-warning">Upcoming Event</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
          {event.seatsAvailable ? `${event.seatsAvailable} seats left` : 'Open Entry'}
        </span>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.85rem', lineHeight: '1.3' }}>
        {event.title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--color-slate-600)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Calendar size={16} color="var(--color-primary-600)" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={16} color="var(--color-primary-600)" />
          <span>{event.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MapPin size={16} color="var(--color-primary-600)" />
          <span>{event.location}</span>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', marginBottom: '1.5rem', flex: 1 }}>
        {event.description}
      </p>

      <Button variant="primary" size="sm" onClick={() => onRegister?.(event)}>
        Register Free
      </Button>
    </div>
  );
}
