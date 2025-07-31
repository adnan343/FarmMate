import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');
        try {
            const res = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                onLogin(data.data);
                navigate('/home');
            } else {
                setMessage(data.msg || 'Login failed');
            }
        } catch (err) {
            setMessage('Something went wrong');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <p>{message}</p>
                <p style={{ marginTop: 10 }}>
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f3f4f6' },
    card: { padding: 30, background: '#fff', borderRadius: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: 10, margin: '10px 0', borderRadius: 4, border: '1px solid #ccc' },
    button: { width: '100%', padding: 10, backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }
};
