import React, { useEffect, useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import '../index.css';

const API_BASE_URL = 'https://api.dustipharma.tj:1212/api/v1';

const FileInput = ({ label, accept, onFileChange }) => {
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName('');
      onFileChange(null);
    }
  };

  return (
    <div className="banner-file-wrapper">
      <label className="banner-file-label">{label}</label>
      <label className="banner-file-button">
        Выберите файл
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="banner-file-hidden"
        />
      </label>
      <span className="banner-file-filename">{fileName || 'Файл не выбран'}</span>
    </div>
  );
};

const getImageUrl = (poster_path) => {
  if (!poster_path) return 'https://placehold.co/120x80?text=No+Image';

  if (
    poster_path.startsWith('/api/uploads/') ||
    poster_path.startsWith('/uploads/')
  ) {
    return `https://api.dustipharma.tj:1212${poster_path}`;
  }

  return `https://api.dustipharma.tj:1212/api/uploads/${poster_path}`;
};

const ListOfBlocks = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, isLoading: authLoading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: '',
    title: '',
    description: '',
  });
  const [editPosterFile, setEditPosterFile] = useState(null);
  const [editPdfFile, setEditPdfFile] = useState(null);

  const fetchBanners = async () => {
    try {
      if (!token) throw new Error('Пользователь не авторизован. Токен отсутствует.');

      const response = await axios.get(`${API_BASE_URL}/app/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bannersData = response.data.payload.data;
      setBanners(Array.isArray(bannersData) ? bannersData : []);
    } catch (err) {
      console.error('Ошибка при получении баннеров:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchBanners();
  }, [authLoading, token]);

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить баннер?')) return;

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/app/admin/banners/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code === 200 || response.data.success) {
        setBanners((prev) => prev.filter((banner) => banner.id !== id));
      } else {
        alert('Ошибка при удалении баннера');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error.response?.data || error.message);
      alert('Ошибка при удалении баннера');
    }
  };

  const handleOpenEditModal = (banner) => {
    setEditData({
      id: banner.id,
      title: banner.title || '',
      description: banner.description || '',
    });
    setEditPosterFile(null);
    setEditPdfFile(null);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const { id, title, description } = editData;

    if (!title.trim()) {
      alert('Название не может быть пустым');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (editPosterFile) {
        formData.append('poster', editPosterFile);
      }

      if (editPdfFile) {
        formData.append('file', editPdfFile);
      }

      const { data } = await axios.put(
        `${API_BASE_URL}/app/admin/banners/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.code === 200 || data.success) {
        await fetchBanners();
        setIsModalOpen(false);
        setEditPosterFile(null);
        setEditPdfFile(null);
      } else {
        alert('Ошибка при обновлении баннера');
      }
    } catch (error) {
      console.error('Ошибка при обновлении:', error.response?.data || error.message);
      alert('Ошибка при обновлении баннера');
    }
  };

  if (loading || authLoading) return <p>Загрузка баннеров...</p>;
  if (error) return <p className="error-text">Ошибка: {error}</p>;

  return (
    <div className="banner-wrapper">
      <div className="statistics_paragraph banners-search">
        <Breadcrumb
          items={[
            { label: 'Панель MobileApp', to: '/mobile' },
            { label: 'Управление блоками' },
          ]}
        />
        <input placeholder="Найти" type="text" />
      </div>

      <h2>Управление блоками</h2>
      <div className="background-table">
        {banners.length === 0 ? (
          <p>Нет доступных баннеров</p>
        ) : (
          <table className="banner-table">
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Описание</th>
                <th>Дата создания</th>
                <th>Дата обновления</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(({ id, title, description, poster_path, created_at, updated_at }) => {
                const imgUrl = getImageUrl(poster_path);
                return (
                  <tr key={id}>
                    <td className="img-cell">
                      <div className="img-cell">
                        <img
                          src={imgUrl}
                          alt={title}
                          className="banner-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/120x80?text=No+Image';
                          }}
                        />
                        <span>{title}</span>
                      </div>
                    </td>
                    <td>{description}</td>
                    <td>{new Date(created_at).toLocaleDateString('ru-RU')}</td>
                    <td>{new Date(updated_at).toLocaleDateString('ru-RU')}</td>
                    <td className="banner-action">
                      <Trash2
                        size={20}
                        color="#0B9D9F"
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => handleDeleteBanner(id)}
                      />
                      <Edit
                        size={20}
                        color="#0B9D9F"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenEditModal({ id, title, description })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Редактировать Блок</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="modal-body">
              <label>Название</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />

              <label>Описание</label>
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />

              <FileInput
                label="Изображение (poster)"
                accept="application/*"
                onFileChange={setEditPosterFile}
              />

              <FileInput
                label="Файл (file)"
                accept="application"
                onFileChange={setEditPdfFile}
              />
            </div>
            <div className="modal-footer">
              <button onClick={handleEditSubmit}>Сохранить</button>
              <button onClick={() => setIsModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfBlocks;
