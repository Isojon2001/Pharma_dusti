import React, { useEffect, useState } from 'react';
import { LayoutGrid, Eye, Users, Trash2 } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function Partner() {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // 🔍 Поиск
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user['Наименование']?.toLowerCase().includes(term) ||
      user['ВидКонтрагента']?.toLowerCase().includes(term) ||
      user['Телефон']?.toLowerCase().includes(term) ||
      user['МенеджерКонтрагента']?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 📦 Загрузка всех пользователей
  useEffect(() => {
    if (!token) return;

    fetch('http://api.dustipharma.tj:1212/api/v1/app/admin/users?page=1&size=10000', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.payload || []);
      })
      .catch(err => console.error('Ошибка загрузки пользователей:', err));
  }, [token]);

  // 👤 Загрузка профиля текущего пользователя
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
        setProfile(Array.isArray(payload) ? payload[0] : payload || null);
      })
      .catch(err => {
        console.error('Ошибка загрузки профиля:', err);
        setProfile(null);
      });
  }, [token]);

  // 👁 Просмотр пользователя
  const handleView = user => {
    alert(`📄 Информация о пользователе:

Ф.И.О: ${user['Наименование'] || '—'}
Роль: ${user['ВидКонтрагента'] || '—'}
Телефон: ${user['Телефон'] || '—'}
Адрес: ${user['Адрес'] || user['БизнесРегион'] || '—'}
ИНН: ${user['ИНН'] || '—'}
Менеджер: ${user['МенеджерКонтрагента'] || '—'}
ID: ${user.id || '—'}`);
  };

  // 🗑 Удаление пользователя
  const handleDelete = async userId => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;

    try {
      const res = await fetch(`http://api.dustipharma.tj:1212/api/v1/app/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      alert('Не удалось удалить пользователя.');
    }
  };

  return (
    <div className="dashboard">
      {/* 📌 Sidebar */}
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
                <button onClick={() => { logout(); window.location.href = '/'; }} className="logout-btn">
                  🚪 Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 📋 Main Content */}
      <main className="content">
        <div className="root_header">
          <h1>Партнёры</h1>
          <input
            type="text"
            placeholder="Найти по имени, роли, телефону..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
                  <td>{u['Наименование'] || '—'}</td>
                  <td>{u['ВидКонтрагента'] || '—'}</td>
                  <td>{u['БизнесРегион'] || u['Адрес'] || '—'}</td>
                  <td>{u['Телефон'] || '—'}</td>
                  <td>{u['МенеджерКонтрагента'] || '—'}</td>
                  <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Eye size={20} style={{ cursor: 'pointer' }} onClick={() => handleView(u)} />
                    <Trash2 size={20} color="red" style={{ cursor: 'pointer' }} onClick={() => handleDelete(u.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Pagination */}
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
