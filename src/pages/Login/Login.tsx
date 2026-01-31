import React, { useState } from 'react';
import { login, storeAuthToken } from '@/api/auth-api';
import styles from './login-page.module.css';

/**
 * Login Page Component
 */
const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            // Call the login API
            const response = await login({ name, password });

            // Store the auth token in localStorage
            if (response.data) {
                storeAuthToken(response.data);
                setSuccess(true);
                setError(null);
                
                // Optional: Redirect to home page or dashboard after successful login
                // window.location.href = '/';
            } else {
                setError('Login failed: No token received');
            }
        } catch (err) {
            // Handle error
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(errorMessage);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Login</h1>
                
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your name"
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your password"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.successMessage}>
                            Login successful!
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
