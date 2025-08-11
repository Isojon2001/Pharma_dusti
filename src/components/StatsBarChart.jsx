import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

function StatsBarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          `http://api.dustipharma.tj:1212/api/v1/app/admin/statistics/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const payload = res.data.payload;

        const formattedData = [
          {
            name: 'Прошлый месяц',
            Заявки: payload.order_prev_month,
            Пользователи: payload.users_prev_month,
            Продукты: payload.products_prev_month,
          },
          {
            name: 'Текущий месяц',
            Заявки: payload.order_current_month,
            Пользователи: payload.users_current_month,
            Продукты: payload.products_current_month,
          }
        ];

        setData(formattedData);
      } catch (err) {
        setError('Не удалось загрузить данные графика');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50, color: '#666', fontSize: 18 }}>Загрузка графика...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: 50, fontSize: 18 }}>{error}</p>;
  if (data.length === 0) return <p style={{ textAlign: 'center', marginTop: 50, color: '#999', fontSize: 18 }}>Нет данных для графика.</p>;

  return (
    <div style={{
      width: '100%',
      maxWidth: 900,
      margin: '40px auto',
      padding: 30,
      background: '#f9fbfc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      borderRadius: 15,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#2c3e50',
    }}>
      <h3 style={{
        textAlign: 'left',
        marginBottom: 25,
        color: '#34495e',
        fontWeight: '700',
        fontSize: '1.8rem',
        letterSpacing: '0.03em',
      }}>
        Статистика по месяцам
      </h3>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Заявки" fill="#3498db" />
          <Bar dataKey="Пользователи" fill="#2ecc71" />
          <Bar dataKey="Продукты" fill="#e67e22" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsBarChart;
