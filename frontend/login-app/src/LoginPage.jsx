// src/LoginPage.jsx
import { useState } from 'react';

export default function LoginPage({ onLogin, onSignupClick, successMessage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(successMessage || '');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const user = result.data;
                sessionStorage.setItem('userId', user.userId);
                sessionStorage.setItem('name', user.name);
                sessionStorage.setItem('email', user.email);
                sessionStorage.setItem('userType', user.userType);
                setMessage('');
                onLogin();
            } else {
                setMessage(result.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage('Something went wrong: ' + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                <p style={styles.switchText}>
                    Don’t have an account?{' '}
                    <button onClick={onSignupClick} style={styles.linkButton}>Sign up</button>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: 320,
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white'
    },
    title: {
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
        border: '1px solid #ccc',
        fontSize: 14
    },
    button: {
        width: '100%',
        padding: 10,
        backgroundColor: '#4f46e5',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer'
    },
    message: {
        marginTop: 10,
        color: 'red',
        textAlign: 'center'
    },
    switchText: {
        marginTop: 15,
        textAlign: 'center'
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#4f46e5',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: 0
    }
};
