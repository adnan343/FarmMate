// src/HomePage.jsx
export default function HomePage({ onLogout }) {
    const name = sessionStorage.getItem('name');
    const email = sessionStorage.getItem('email');
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1>Hello, {name}!</h1>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>User ID:</strong> {userId}</p>
                <p><strong>User Type:</strong> {userType}</p>
                <button onClick={onLogout} style={styles.button}>Logout</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        backgroundColor: '#eef2f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        padding: 30,
        borderRadius: 12,
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: 400
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ef4444',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer'
    }
};
