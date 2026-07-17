import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiDollarSign } from 'react-icons/fi';
import '../css/Auth.css';

const Auth = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body = isLogin 
      ? { email: form.email, password: form.password }
      : form;

    console.log('🔵 Sending to:', endpoint, body);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      console.log('🔵 Response status:', res.status);

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('❌ Non-JSON response:', text);
        setMessage('Server error (non-JSON response). Check console.');
        setLoading(false);
        return;
      }

      console.log('🔵 Response data:', data);

      if (res.ok) {
        // ✅ Login or Registration successful – cookie is set, go to dashboard
        setUser(data.user);
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setMessage('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-left">
        <div className="logo-container">
          <FiDollarSign size={80} color="#3498db" />
        </div>
        <h1>Wallet</h1>
        <p>Manage your finances, track allocations, and grow your savings all in one place.</p>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <span 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            {message && (
              <p className={`auth-message ${message.includes('successful') || message.includes('created') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}

            {isLogin && (
              <p className="forgot-password" onClick={() => navigate('/reset')}>
                Forgot Password?
              </p>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? (
              <>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></>
            ) : (
              <>Already signed in? <span onClick={() => setIsLogin(true)}>Log in</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;