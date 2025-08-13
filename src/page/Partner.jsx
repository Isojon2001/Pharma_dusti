import React, { useEffect, useState } from 'react';
import { LayoutGrid, Phone, Plus, Eye,Users, Edit, Trash2 } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import '../index.css';

function Partner() {
  const [profileUsers, setProfileUsers] = useState([]);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;
const totalPages = Math.ceil(users.length / itemsPerPage);

const paginatedUsers = users.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
useEffect(() => {
  const stored = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');

  if (stored) {
    setUser(JSON.parse(stored));
  }

  // Первый запрос — admin users
  fetch('http://api.dustipharma.tj:1212/api/v1/app/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
      return res.json();
    })
    .then(data => setUsers(data.payload))
    .catch(error => console.error('Ошибка при получении пользователей:', error));

  // Второй запрос — profile users
  fetch('http://api.dustipharma.tj:1212/api/v1/app/profile/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const profileList = data.payload;
      setProfileUsers(profileList);

      // Найдём профиль текущего пользователя по ID или другому признаку
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const matchedProfile = profileList.find(p => p.id === storedUser?.id);

      if (matchedProfile) {
        setUser(prev => ({
          ...prev,
          Наименование: matchedProfile['Наименование'] || prev['Наименование']
        }));
      }
    })
    .catch(error => console.error('Ошибка при получении профилей:', error));
}, []);


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
            <SidebarItem 
              icon={() => <img src="./Icons-3.svg" alt="Роли и права" />} label="Роли и права" to="/RoleAndRoot" />
            <SidebarItem icon={Users} label="Partner" to="/Partner" />
            <SidebarItem icon={() => <img src="./Icons-4.svg" alt="MobileApp" />} label="Панель MobileApp" to="/mobile" />
              <SidebarItem
                icon={() => <img src="./call.svg" width={20} height={20} alt="Звонки" />}
                label="Журнал звонков"
                to="/calls"
              />
          </div>
        </div>

        <div className="sidebar_block">
          <p>Служба поддержки</p>
          <div className="sidebar_user">
            <div className="logo_flex">
              <div className="logo_user"></div>
              <div className="logo_profile">
              <h3>{user.Наименование || 'Имя не указано'}</h3>
                <p>{user.counterparty_type || 'Филиал не указан'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="content">
        <div className='root_header'>
          <div>
            <h1>Партнёры</h1>
          </div>
        </div>

        <div className='back_color_table'>
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
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{u['Наименование'] || '-'}</td>
                  <td>{u['ВидКонтрагента'] || '-'}</td>
                  <td>{u['БизнесРегион' || 'Адрес'] || ''}</td>
                  <td>{u['Телефон'] || '-'}</td>
                  <td>{u['МенеджерКонтрагента'] || '-'}</td>
                  <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Eye size={20} style={{ cursor: 'pointer' }} />
                    <Trash2 size={20} color="red" style={{ cursor: 'pointer' }} />
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

  <span>Страница {currentPage} из {totalPages}</span>

  <button
    disabled={currentPage === totalPages}
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
