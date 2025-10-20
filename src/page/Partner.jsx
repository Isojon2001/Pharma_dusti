import React, { useEffect, useState } from 'react';
import { LayoutGrid, Eye, Users, User, Trash2 } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function Partner() {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(7);

  const getSearchParam = (term) => {
    const cleaned = term.trim();
    const isPhone = /^\d{6,}$/.test(cleaned);
    return isPhone ? { numberPhone: cleaned } : { fullName: cleaned };
  };

  useEffect(() => {
    if (!token) return;

    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('size', size.toString());

    const term = searchTerm.trim();
    if (term) {
      const searchParam = getSearchParam(term);
      Object.entries(searchParam).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    fetch(`https://api.dustipharma.tj:1212/api/v1/app/admin/users?${params.toString()}`, {
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
  }, [token, searchTerm, currentPage, size]);

  useEffect(() => {
    if (!token) return;

    fetch('https://api.dustipharma.tj:1212/api/v1/app/profile/users', {
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

  const handleView = user => {
    alert(`Информация о пользователе:

Ф.И.О: ${user['Наименование'] || '—'}
Роль: ${user['ВидКонтрагента'] || '—'}
Телефон: ${user['Телефон'] || '—'}
Адрес: ${user['Адрес'] || user['БизнесРегион'] || '—'}
ИНН: ${user['ИНН'] || '—'}
Менеджер: ${user['МенеджерКонтрагента'] || '—'}
ID: ${user.id || '—'}`);
  };

  const handleDelete = async userId => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;

    try {
      const res = await fetch(`https://api.dustipharma.tj:1212/api/v1/app/admin/users/${userId}`, {
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
      <aside className="sidebar">
        <div>
          <div className="sidebar_logo">
            <img src="./logo.svg" alt="logo" />
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
          <div className="sidebar_user">
            <div className="logo_flex">
              <div className="logo_user"><User className="user-icon" /></div>
              <div className="logo_profile">
                <h3>{profile?.['Наименование']?.trim() || 'Имя не указано'}</h3>
                <p>{profile?.['ВидКонтрагента']?.trim() || 'Роль не указана'}</p>
              </div>
              <button onClick={() => { logout(); window.location.href = '/'; }} className="logout-btn">
                Выйти
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="content">
        <div className="root_header">
          <h1>Партнёры</h1>
          <input
            type="text"
            placeholder="Поиск по имени или телефону"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
              {users.map((u, index) => (
                <tr key={u.id || index}>
                  <td>{(currentPage - 1) * size + index + 1}</td>
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

          <div className="pagination_controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              ◀ Назад
            </button>

            <span>Страница {currentPage}</span>

            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Вперёд ▶
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Partner;
