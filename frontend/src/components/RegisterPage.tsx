import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: password
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

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

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canResend) return;
    
    // Здесь будет логика отправки кода
    console.log('Send code to:', email);
    setCodeSent(true);
    setCanResend(false);
    setTimer(60);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика проверки кода
    console.log('Verify code:', code);
    setStep(3);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем что пароли совпадают
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    // Здесь будет логика регистрации
    console.log('Register:', { email, password });
    navigate('/login');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="register-page">
      <Header />
      <div className="register-content">
        <div className="register-container">
          <div className="register-wrapper">
            <div className="register-header">
              <h1 className="register-title">Регистрация</h1>
              <p className="register-subtitle">
                {step === 1 && "Введите email для регистрации"}
                {step === 2 && "Введите код подтверждения"}
                {step === 3 && "Создайте пароль"}
              </p>
            </div>

            {/* Шаг 1: Ввод email */}
            {step === 1 && (
              <form className="register-form" onSubmit={handleSendCode}>
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
                  className="register-button"
                  disabled={!email}
                >
                  Отправить код
                </button>
              </form>
            )}

            {/* Форма для ввода кода (появляется снизу после отправки) */}
            {codeSent && step === 1 && (
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

                <button type="submit" className="register-button">
                  Отправить
                </button>
              </form>
            )}

            {/* Таймер под кнопкой "Отправить код" */}
            {codeSent && step === 1 && (
              <div className="timer-container">
                <span className="timer-text">
                  {canResend ? 'Код отправлен' : `Повторная отправка через ${formatTime(timer)}`}
                </span>
              </div>
            )}

            {/* Шаг 2: Ввод кода (отдельный шаг) */}
            {step === 2 && (
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

                <button type="submit" className="register-button">
                  Отправить
                </button>
                
                <div className="timer-container">
                  <span className="timer-text">
                    {canResend ? 'Код отправлен' : `Повторная отправка через ${formatTime(timer)}`}
                  </span>
                </div>
              </form>
            )}

            {/* Шаг 3: Ввод пароля */}
            {step === 3 && (
              <form className="register-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Пароль</label>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="register-button">
                  Зарегистрироваться
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
