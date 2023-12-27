import React, { useState } from 'react';
// import './App.css';

function Test() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [batch, setBatch] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await fetch('http://localhost:8000/student/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    batch: parseInt(batch),
                }),
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8000/student/log-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                    name: "cacing",
                    batch: "ayamgoblokkk test doang anjeng ga penting tp hrs diisi kontttt"
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error during login:', data);
                // Handle specific errors (422) and display appropriate messages
                if (Array.isArray(data.detail) && data.status_code === 422) {
                    data.detail.forEach((error) => {
                        console.error('Validation error:', error.msg);
                        // TODO: Display error messages to the user
                    });
                }
                return;
            }

            console.log(data);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="App">
            <h1>Comm4Unity Frontend</h1>
            <div>
                <h2>Sign Up</h2>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <label>Batch:</label>
                <input type="number" value={batch} onChange={(e) => setBatch(e.target.value)} />
                <br />
                <button onClick={handleSignUp}>Sign Up</button>
            </div>

            <div>
                <h2>Login</h2>
                <label>Email:</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <br />
                <label>Password:</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <br />
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default Test;
