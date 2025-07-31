// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        userType: 'Farmer'
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/login', { state: { signupSuccess: true } });
            } else {
                setMessage(data.message || 'Signup failed');
            }
        } catch (err) {
            setMessage('Error occurred: ' + err.message);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div style={{ marginBottom: 10 }}>
                    <label>Email:</label><br />
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Password:</label><br />
                    <input name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Name:</label><br />
                    <input name="name" type="text" value={form.name} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>User Type:</label><br />
                    <select name="userType" value={form.userType} onChange={handleChange}>
                        <option value="Farmer">Farmer</option>
                        <option value="Expart">Expart</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>

            <p style={{ marginTop: 10 }}>{message}</p>

            <p style={{ marginTop: 20 }}>
                Already have an account? <Link to="/login">Back to Login</Link>
            </p>
        </div>
    );
}

export default SignupPage;
