import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './NewPasswordPage.css';

const NewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика сохранения нового пароля
    console.log('Save new password:', { newPassword, confirmPassword });
    // Перенаправляем на страницу логина
    navigate('/login');
  };

  return (
    <div className="new-password-page">
      <Header />
      <div className="new-password-content">
        <div className="new-password-container">
          <div className="new-password-wrapper">
            <div className="new-password-header">
              <h1 className="new-password-title">Новый пароль</h1>
              <p className="new-password-subtitle">Введите новый пароль для вашего аккаунта</p>
            </div>

            <form className="new-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">Новый пароль</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-input"
                  placeholder="Введите новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Подтвердите новый пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="save-button">
                Сохранить пароль
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
