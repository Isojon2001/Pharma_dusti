import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import FileInputFixedStatus from '../components/FileInputFixedStatus';

function AddBlockPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

const handleAddBanner = async () => {
  if (!title.trim()) {
    setMessage('Введите название баннера');
    return;
  }

  const poster = document.getElementById('poster1')?.files?.[0];
  const file = document.getElementById('poster2')?.files?.[0];

  if (!poster || !file) {
    setMessage('Загрузите оба файла (poster и file)');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('is_active', isActive);
    formData.append('poster', poster);
    formData.append('file', file);

    const response = await axios.post(
      'http://api.dustipharma.tj:1212/api/v1/app/admin/banners',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const { code, message, payload } = response.data;

    if (code === 200 || code === 201) {
      setMessage('Баннер успешно добавлен');

      // 👉 Выводим путь к изображению
      const posterPath = payload?.data?.poster_path;
      if (posterPath) {
        const imgUrl = `http://api.dustipharma.tj:1212/api/v1/files/${posterPath}`;
        console.log('✅ Изображение успешно загружено:');
        console.log('URL изображения:', imgUrl);
      } else {
        console.warn('⚠️ Сервер не вернул путь к изображению (poster_path)');
      }

      setTimeout(() => {
        navigate('/mobile');
      }, 1500);
    } else {
      setMessage('Ошибка при добавлении баннера');
    }
  } catch (error) {
    console.error('Ошибка:', error.response?.data || error.message);
    setMessage(error.response?.data?.message || 'Ошибка при добавлении баннера');
  }
};


  return (
    <div className="add-category-page">
      <Breadcrumb
        className="category_breadcrumb"
        items={[
          { label: 'PanelMobil', to: '/mobile' },
          { label: 'Управление баннерами' },
        ]}
      />

      <div className="add-category-forms">
        <div className="add-category-paragraph">
          <h2>Добавление баннера</h2>
          <div className="category_btn">
            <button type="button" onClick={() => navigate('/mobile')}>
              Отменить
            </button>
            <button type="button" onClick={handleAddBanner} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>

        <div className="add-category-form">
          <div className="category-paragraph categories_height_one">
            <p>Наименование</p>
            <input
              type="text"
              placeholder="Название баннера"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="category-paragraph categories_height_two">
            <p>Описание</p>
            <input
              type="text"
              placeholder="Описание баннера"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="category-paragraph">
            <p>Активен ли баннер</p>
            <select value={isActive} onChange={(e) => setIsActive(e.target.value === 'true')}>
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          </div>

          {message && <p className="message">{message}</p>}

          <div className="uploading_poster">
            <p>Загрузить постер</p>
            <FileInputFixedStatus id="poster1" label="Выбрать изображение (poster)" />

            <p>Загрузить основной файл</p>
            <FileInputFixedStatus id="poster2" label="Выбрать файл (file)" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBlockPage;
