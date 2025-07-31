import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import HomePage from './HomePage';
import FarmsPage from './FarmsPage';

function App() {
    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const isLoggedIn = !!user;

    const handleLogin = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route
                    path="/home"
                    element={
                        isLoggedIn ? (
                            <HomePage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/farms"
                    element={
                        isLoggedIn ? (
                            <FarmsPage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
