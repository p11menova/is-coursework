import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<{ email?: string; login?: string } | null>(null);
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    if (!isLoginPage) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-container">
            <div className="feather-logo">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Газета/новостной лист */}
                <rect x="15" y="18" width="50" height="44" rx="2" fill="white" stroke="white" strokeWidth="1" opacity="0.95"/>
                
                {/* Заголовок газеты */}
                <rect x="20" y="23" width="40" height="7" rx="1" fill="MediumPurple"/>
                
                {/* Текстовые колонки */}
                <rect x="20" y="35" width="18" height="3" rx="1" fill="rgba(0, 0, 0, 0.6)"/>
                <rect x="20" y="40" width="18" height="3" rx="1" fill="rgba(0, 0, 0, 0.6)"/>
                <rect x="20" y="45" width="15" height="3" rx="1" fill="rgba(0, 0, 0, 0.6)"/>
                
                <rect x="42" y="35" width="18" height="3" rx="1" fill="rgba(0, 0, 0, 0.6)"/>
                <rect x="42" y="40" width="18" height="3" rx="1" fill="rgba(0, 0, 0, 0.6)"/>
                <rect x="42" y="45" width="15" height="3" rx="1" fill="rgba(0, 0, 0, 0.6)"/>
                
                {/* Изображение в газете */}
                <rect x="20" y="52" width="18" height="10" rx="1" fill="MediumPurple" opacity="0.3"/>
                <rect x="42" y="52" width="18" height="10" rx="1" fill="MediumPurple" opacity="0.3"/>
                
                {/* Сложенная страница эффект */}
                <path d="M15 20L65 20" stroke="rgba(255,255,255,0.8)" strokeWidth="1"/>
                <path d="M15 60L65 60" stroke="rgba(255,255,255,0.8)" strokeWidth="1"/>
                
                {/* Маленькие детали */}
                <circle cx="23" cy="26" r="1" fill="white"/>
                <circle cx="57" cy="26" r="1" fill="white"/>
              </svg>
            </div>
          </div>
          <div className="text-container">
            <h1 className="title">News Flow</h1>
            <p className="tagline">Ваш единый поток новостей.</p>
          </div>
        </div>
        <div className="header-right">
          <div className="weather-currency-widget">
            <div className="weather-section">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="4" fill="#FFD700"/>
                <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.6569 4.34314L14.2426 5.75736M5.75736 14.2426L4.34314 15.6569M15.6569 15.6569L14.2426 14.2426M5.75736 5.75736L4.34314 4.34314" stroke="#FFD700" strokeWidth="2"/>
              </svg>
              <span className="temperature">-10</span>
            </div>
            <div className="currency-section">
              <span className="currency-symbol">$</span>
              <span className="currency-value">78.23</span>
            </div>
          </div>
          <div className="profile-menu-container" ref={profileMenuRef}>
            <div className={`user-icon ${isLoginPage ? 'disabled' : ''}`} onClick={toggleProfileMenu}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="white"/>
                <path d="M12 14C7.59 14 4 15.79 4 18V20H20V18C20 15.79 16.41 14 12 14Z" fill="white"/>
              </svg>
            </div>
            
            {!isLoginPage && user && isProfileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-email">
                  {user.email || user.login}
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                    <path d="M10 3L14 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
