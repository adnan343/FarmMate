// src/SignupPage.jsx
import { useState } from 'react';

export default function SignupPage({ onSignupSuccess, onCancel }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('Farmar');
    const [message, setMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('Creating account...');

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name, userType })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                onSignupSuccess('Signup successful. Please log in.');
            } else {
                setMessage(result.msg || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('Something went wrong: ' + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
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
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        style={styles.input}
                    >
                        <option value="Farmar">Farmar</option>
                        <option value="Buyer">Expart</option>
                    </select>
                    <button type="submit" style={styles.button}>Sign Up</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                <p style={styles.switchText}>
                    Already have an account?{' '}
                    <button onClick={onCancel} style={styles.linkButton}>Login</button>
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
        backgroundColor: '#16a34a',
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
