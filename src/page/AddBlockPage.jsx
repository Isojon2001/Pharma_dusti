import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import FileInputFixedStatus from '../components/FileInputFixedStatus';

function AddBlockPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleAddCategory = async () => {
    if (!name.trim()) {
      setMessage('Введите название Блока');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('key', name.trim().toLowerCase().replace(/\s+/g, '-'));

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

      if (response.data.code === 200) {
        setMessage('Блок успешно добавлена');
        setTimeout(() => {
          navigate('/mobile');
        }, 1500);
      } else {
        setMessage('Ошибка при добавлении блока');
      }
    } catch (error) {
      console.error('Ошибка:', error.response?.data || error.message);
      setMessage('Ошибка при добавлении блока');
    }
  };

  return (
    <div className="add-category-page">
      <Breadcrumb
        className="category_breadcrumb"
        items={[
          { label: 'PanelMobil', to: '/mobile' },
          { label: 'Управление блоками' },
        ]}
      />
      <div className="add-category-forms">
        <div className="add-category-paragraph">
          <h2>Управление Блоками</h2>
          <div className="category_btn">
            <button type="button" onClick={() => navigate('/mobile')}>Отменить</button>
            <button type="button" onClick={handleAddCategory}>Сохранить</button>
          </div>
        </div>
        <div className="add-category-form">
          <div className="category-paragraph categories_height_one">
            <p>Наименование</p>
            <input
              type="text"
              placeholder="Название Блока"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="category-paragraph categories_height_two">
            <p>Описание</p>
            <input
              type="text"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {message && <p className="message">{message}</p>}
          <div className="uploading_poster">
          <h4>Загрузить постер</h4>
          <FileInputFixedStatus id="poster1" label="Выбрать файл 1" />
          <h4>Загрузите Файл</h4>
          <FileInputFixedStatus id="poster2" label="Выбрать файл 2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBlockPage;
