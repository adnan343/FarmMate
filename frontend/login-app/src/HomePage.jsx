import { useNavigate, Link } from 'react-router-dom';

export default function HomePage({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 30 }}>
            <h1>Hello, {user.name}</h1>
            <p>Email: {user.email}</p>
            <p>User Type: {user.userType}</p>
            <button onClick={onLogout} style={{ marginRight: 10 }}>Logout</button>
            <Link to="/farms">
                <button>Farms</button>
            </Link>
        </div>
    );
}
