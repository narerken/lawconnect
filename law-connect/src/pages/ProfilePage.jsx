import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name:'', email:'',
    notifications:{ email:true, inApp:true },
    theme:'light', language:'ru'
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async()=>{
      const { data } = await axios.get('/users/me');
      setUser(data);
      setForm({
        name: data.name,
        email: data.email,
        notifications: data.settings.notifications,
        theme: data.settings.theme,
        language: data.settings.language
      });
    })();
  },[]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name.includes('notifications')) {
      const key = name.split('.')[1];
      setForm(f=>({ ...f, notifications:{ ...f.notifications, [key]: checked }}));
    } else {
      setForm(f => ({ ...f, [name]: type==='checkbox'?checked:value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/users/me', {
        name: form.name,
        email: form.email,
        notifications: form.notifications,
        theme: form.theme,
        language: form.language
      });
      setUser(data);
      setMessage('Профиль обновлён');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleAvatar = e => setAvatarFile(e.target.files[0]);
  const uploadAvatar = async () => {
    if (!avatarFile) return;
    const fd = new FormData();
    fd.append('avatar', avatarFile);
    const { data } = await axios.post('/users/me/avatar', fd);
    setUser(u => ({ ...u, avatarUrl: data.avatarUrl }));
    setMessage('Аватар обновлён');
  };

  if (!user) return <p>Загрузка...</p>;
  return (
    <div className="profile-page">
      <h2>Мой профиль</h2>
      <img src={user.avatarUrl || '/default-avatar.png'} alt="avatar" width={120} />
      <div>
        <input type="file" accept="image/*" onChange={handleAvatar}/>
        <button onClick={uploadAvatar}>Загрузить аватар</button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Имя
          <input name="name" value={form.name} onChange={handleChange}/>
        </label>
        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange}/>
        </label>
        <fieldset>
          <legend>Уведомления</legend>
          <label>
            <input
              type="checkbox"
              name="notifications.email"
              checked={form.notifications.email}
              onChange={handleChange}
            /> Email
          </label>
          <label>
            <input
              type="checkbox"
              name="notifications.inApp"
              checked={form.notifications.inApp}
              onChange={handleChange}
            /> In-App
          </label>
        </fieldset>
        <label>
          Тема
          <select name="theme" value={form.theme} onChange={handleChange}>
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </label>
        <label>
          Язык
          <select name="language" value={form.language} onChange={handleChange}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>

        <button type="submit">Сохранить</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
