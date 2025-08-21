import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StatsBarChart from '../components/StatsBarChart';

function DetailedStats() {
  const { type } = useParams();
  const label = type.replace(/_/g, ' ');

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Назад</Link>
      <h2>Подробная статистика: {label}</h2>
      <StatsBarChart type={type} />
    </div>
  );
}

export default DetailedStats;
