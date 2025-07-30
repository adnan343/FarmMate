// src/App.jsx
import { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SignupPage from './SignupPage';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [page, setPage] = useState('login');
    const [signupSuccessMsg, setSignupSuccessMsg] = useState('');

    useEffect(() => {
        if (sessionStorage.getItem('userId')) {
            setLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setLoggedIn(false);
        setPage('login');
    };

    if (loggedIn) {
        return <HomePage onLogout={handleLogout} />;
    }

    if (page === 'signup') {
        return (
            <SignupPage
                onSignupSuccess={(msg) => {
                    setSignupSuccessMsg(msg);
                    setPage('login');
                }}
                onCancel={() => setPage('login')}
            />
        );
    }

    return (
        <LoginPage
            onLogin={() => setLoggedIn(true)}
            onSignupClick={() => setPage('signup')}
            successMessage={signupSuccessMsg}
        />
    );
}

export default App;
