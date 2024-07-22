import React, { useState } from 'react';
import './login.scss';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });

  const handleLoginClick = () => {
    setIsLogin(true);
    setErrors({ email: '', password: '', confirmPassword: '' });
  };

  const handleSignupClick = () => {
    setIsLogin(false);
    setErrors({ email: '', password: '', confirmPassword: '' });
  };

  const validateForm = () => {
    let formErrors = { email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!isLogin && password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if(email === "scora@gmail.com" && password === "scora@123"){
        sessionStorage.setItem("user", email);
        navigate('/');
      } else {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="title-text">
        <div className={`title ${isLogin ? 'login' : 'signup'}`}>
          {isLogin ? 'Login' : 'Signup'}
        </div>
      </div>
      <div className="form-container">
        <div className="slide-controls">
          <input type="radio" name="slide" id="login" checked={isLogin} onChange={handleLoginClick} />
          <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={handleSignupClick} />
          <label htmlFor="login" className="slide login" onClick={handleLoginClick}>
            Login
          </label>
          <label htmlFor="signup" className="slide signup" onClick={handleSignupClick}>
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>
        <div className="form-inner">
          <form className={`form ${isLogin ? 'login' : 'signup'}`} onSubmit={handleSubmit}>
            <div className="field">
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            {!isLogin && (
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
            )}
            <br></br>
            <div className="pass-link">{isLogin && <a href="#">Forgot password?</a>}</div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value={isLogin ? 'Login' : 'Signup'} />
            </div>
            <div className="signup-link">
              {isLogin ? (
                <div style={{color: "black"}}>Not a member? <a href="#" onClick={handleSignupClick}>Signup now</a></div>
              ) : (
                <div style={{color: "black"}}>Already a member? <a href="#" onClick={handleLoginClick}>Login now</a></div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
