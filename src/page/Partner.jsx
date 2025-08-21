import React, { useEffect, useState } from 'react';
import { LayoutGrid, Eye, Users, Trash2 } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function Partner() {
  const { token } = useAuth();
  const [adminUsers, setAdminUsers] = useState([]);
  const [clientUsers, setClientUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(clientUsers.length / itemsPerPage);
  const paginatedUsers = clientUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Загрузка списка пользователей
  useEffect(() => {
    if (!token) return;

    fetch('http://api.dustipharma.tj:1212/api/v1/app/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const allUsers = data.payload || [];

        const admins = allUsers.filter(
          u =>
            ['admin', 'moderator'].includes(u['Роль']?.toLowerCase()) ||
            ['admin', 'moderator'].includes(u['ВидКонтрагента']?.toLowerCase())
        );

        const clients = allUsers.filter(
          u => u['ВидКонтрагента']?.toLowerCase() === 'клиент'
        );

        setAdminUsers(admins);
        setClientUsers(clients);
      })
      .catch(error => console.error('Ошибка при получении пользователей:', error));
  }, [token]);

  // Загрузка профиля текущего пользователя
useEffect(() => {
  if (!token) return;

  fetch('http://api.dustipharma.tj:1212/api/v1/app/profile/users', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      const payload = data.payload;

      if (Array.isArray(payload)) {
        setProfile(payload[0] || null);
      } else if (typeof payload === 'object') {
        setProfile(payload);
      } else {
        console.warn('Неподдерживаемый формат профиля:', payload);
        setProfile(null);
      }
    })
    .catch(error => {
      console.error('Ошибка при загрузке профиля:', error);
      setProfile(null);
    });
}, [token]);



  const handleView = (user) => {
    alert(
      `📄 Информация о пользователе:

Ф.И.О: ${user['Наименование'] || '—'}
Роль: ${user['ВидКонтрагента'] || '—'}
Телефон: ${user['Телефон'] || '—'}
Адрес: ${user['Адрес'] || user['БизнесРегион'] || '—'}
ИНН: ${user['ИНН'] || '—'}
Менеджер: ${user['МенеджерКонтрагента'] || '—'}
ID: ${user.id || '—'}
      `
    );
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить пользователя?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://api.dustipharma.tj:1212/api/v1/app/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления: ${response.status}`);
      }

      setClientUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      alert('Не удалось удалить пользователя.');
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <div className="sidebar_logo">
            <img src="./Dusti_pharma.png" width="40" height="40" alt="logo" />
            <h2>Дусти фарма</h2>
          </div>

          <div className="sidebar-menu">
            <SidebarItem icon={LayoutGrid} label="Статистика" to="/dashboard" />
            <SidebarItem icon={() => <img src="./Icons-3.svg" alt="Роли и права" />} label="Роли и права" to="/RoleAndRoot" />
            <SidebarItem icon={Users} label="Partner" to="/Partner" />
            <SidebarItem icon={() => <img src="./Icons-4.svg" alt="MobileApp" />} label="Панель MobileApp" to="/mobile" />
            <SidebarItem icon={() => <img src="./call.svg" width={20} height={20} alt="Звонки" />} label="Журнал звонков" to="/calls" />
          </div>
        </div>

        <div className="sidebar_block">
          <p>Служба поддержки</p>
          <div className="sidebar_user">
            <div className="logo_flex">
              <div className="logo_user"></div>
              <div className="logo_profile">
                <h3>{profile?.['Наименование']?.trim() || 'Имя не указано'}</h3>
                <p>{profile?.['ВидКонтрагента']?.trim() || 'Роль не указана'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="content">
        <div className="root_header">
          <div>
            <h1>Партнёры</h1>
          </div>
        </div>

        <div className="back_color_table">
          <table className="user-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Ф.И.О</th>
                <th>КонтрАгент</th>
                <th>Адрес</th>
                <th>Телефон</th>
                <th>Менеджер</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u, index) => (
                <tr key={u.id || index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{u['Наименование'] || '-'}</td>
                  <td>{u['ВидКонтрагента'] || '-'}</td>
                  <td>{u['БизнесРегион'] || u['Адрес'] || '-'}</td>
                  <td>{u['Телефон'] || '-'}</td>
                  <td>{u['МенеджерКонтрагента'] || '-'}</td>
                  <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Eye size={20} style={{ cursor: 'pointer' }} onClick={() => handleView(u)} />
                    <Trash2 size={20} color="red" style={{ cursor: 'pointer' }} onClick={() => handleDelete(u.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination_controls">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
              ◀ Назад
            </button>
            <span>Страница {currentPage} из {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
              Вперёд ▶
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Partner;
