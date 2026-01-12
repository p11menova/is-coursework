import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { authAPI } from '../api/auth';
import './ForgotPasswordPage.css';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => window.clearInterval(interval);
  }, [timer, canResend]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canResend) return;
    
    setError('');
    setLoading(true);
    
    try {
      await authAPI.forgotPassword(email);
      setCodeSent(true);
      setCanResend(false);
      setTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка отправки кода. Проверьте email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Введите код');
      return;
    }
    // Сохраняем email и код для страницы нового пароля
    localStorage.setItem('resetEmail', email);
    localStorage.setItem('resetCode', code);
    navigate('/new-password');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="forgot-password-page">
      <Header />
      <div className="forgot-password-content">
        <div className="forgot-password-container">
          <div className="forgot-password-wrapper">
            <div className="forgot-password-header">
              <h1 className="forgot-password-title">Восстановление пароля</h1>
              <p className="forgot-password-subtitle">Введите email для восстановления доступа к аккаунту</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <form className="forgot-password-form" onSubmit={handleSendCode}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="reset-button"
                disabled={!canResend || loading}
              >
                {loading ? 'Отправка...' : 'Отправить код'}
              </button>
            </form>

            {codeSent && (
              <form className="code-form" onSubmit={handleVerifyCode}>
                <div className="form-group">
                  <label htmlFor="code" className="form-label">Код подтверждения</label>
                  <input
                    type="text"
                    id="code"
                    className="form-input"
                    placeholder="Введите код из письма"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>

                <button type="submit" className="reset-button">
                  Отправить
                </button>
              </form>
            )}

            {/* Таймер под кнопкой "Отправить код" */}
            {codeSent && (
              <div className="timer-container">
                <span className="timer-text">
                  {canResend ? 'Код отправлен' : `Повторная отправка через ${formatTime(timer)}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
