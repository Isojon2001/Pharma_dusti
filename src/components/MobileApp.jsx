import React, { useEffect, useState } from 'react';
import { LayoutGrid, Phone, Users } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function MobileApp() {
    const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
useEffect(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    axios.get('http://api.dustipharma.tj:1212/api/v1/app/profile/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const profiles = Array.isArray(res.data?.payload) ? res.data.payload : [];

      const matched = profiles.find(p =>
        p.Телефон === parsedUser.phone || p.id === parsedUser.id
      );

      if (matched) {
        setUser(prev => ({
          ...prev,
          full_name: matched.Наименование || prev.full_name,
        }));
      }
    })
    .catch(err => {
      console.error('Ошибка при получении Наименования:', err.response?.data || err.message);
    });
  }
}, []);


  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        'http://api.dustipharma.tj:1212/api/v1/app/categories/all',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Ответ от сервера:', response.data);
      const payload = response.data.payload.data;

      if (Array.isArray(payload)) {
        const safeCategories = payload.map((item) => ({
          id: item.id,
          name: item.name ?? 'Без названия',
          description: item.description ?? '',
        }));
        setCategories(safeCategories);
      } else {
        console.error('Неправильная структура данных:', payload);
      }
    } catch (error) {
      console.error('Ошибка при получении категорий:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Добавление новой категории
 const handleAddCategory = async () => {
  if (!name.trim()) {
    setMessage('Введите название категории');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('key', name.trim().toLowerCase().replace(/\s+/g, '-'));

    console.log('Перед отправкой (FormData):', name, description);

    const response = await axios.post(
      'http://api.dustipharma.tj:1212/api/v1/app/categories',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Ответ от сервера:', response.data);

    if (response.data.code === 200) {
      setMessage('Категория успешно добавлена');
      setName('');
      setDescription('');
      fetchCategories();

      setTimeout(() => {
        setShowForm(false);
        setMessage('');
      }, 2000);
    } else {
      setMessage('Ошибка при добавлении категории');
    }
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error.response?.data || error.message);
    setMessage(' Ошибка при добавлении категории');
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
                <h3>{user.full_name || 'Имя не указано'}</h3>
                <p>{user.counterparty_type || 'Филиал не указан'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="content">
        <div className="panel_content">
          <h2>Панел MobileApp</h2>
          <div className="panel_mobile">
            <div className="panel_button">
              <h4>Управление категориям</h4>
              <div className="panel_btn">
                <button>Все категории</button>
                <button>Добавить</button>
              </div>
            </div>

            <div className="panel_button">
              <h4>Push-Уведомление</h4>
              <div className="panel_btn">
                <button>История</button>
                <button>Добавить</button>
              </div>
            </div>

            <div className="panel_button">
              <h4>Управление блоками</h4>
              <div className="panel_btn">
                <button>История</button>
                <button onClick={() => navigate('/add-category')}>Добавить</button>
                {showForm && (
                <div className="add-category-form">
                  <input
                    type="text"
                    placeholder="Название категории"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button onClick={handleAddCategory}>Сохранить</button>
                  {message && <p>{message}</p>}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MobileApp;
