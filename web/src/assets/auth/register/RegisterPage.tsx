import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../../api';
import axios from 'axios';
import s from './RegisterPage.module.css';
import { useAuthContext } from '../../../context/Authcontext';
import { ApiResponse, registerForm, User } from '../../../user';

interface RegisterPageProps {
  onNavigate?: (page: string) => void;
}

function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<registerForm>();
  const { login } = useAuthContext();

  const onSubmitRegister = async (data: registerForm) => {
    try {
      setIsLoading(true);
      const res = await api.post<ApiResponse<User>>('/auth/register', data);
      const { token, user } = res.data;
      login(token, user);
      reset();
      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [password, setPassword] = useState('');

  const getPasswordStrength = (pw: string) => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'var(--danger)' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'var(--warning)' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'var(--info)' };
    return { level: 4, label: 'Strong', color: 'var(--success)' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className={s.page}>
      <div className={s.bgGradient} />
      <div className={s.bgGrid} />
      <div className={s.floatingOrb1} />
      <div className={s.floatingOrb2} />
      <div className={s.floatingOrb3} />

      <div className={s.container}>
        {/* Left Panel — Branding */}
        <div className={s.brandPanel}>
          <div className={s.brandContent}>
            <div className={s.logo}>
              <div className={s.logoIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="10" fill="url(#regLogoGrad)" />
                  <path d="M9 16.5L13.5 21L23 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="regLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className={s.logoText}>LifeOS</span>
            </div>

            <h1 className={s.brandTitle}>
              Start your journey<br />
              <span className={s.brandTitleGradient}>to a better life</span>
            </h1>
            <p className={s.brandSubtitle}>
              Join thousands of people who've transformed their productivity and achieved their goals with LifeOS.
            </p>

            <div className={s.stats}>
              <div className={s.stat}>
                <span className={s.statValue}>10K+</span>
                <span className={s.statLabel}>Active Users</span>
              </div>
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statValue}>50K+</span>
                <span className={s.statLabel}>Tasks Completed</span>
              </div>
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statValue}>98%</span>
                <span className={s.statLabel}>Satisfaction</span>
              </div>
            </div>

            <div className={s.benefits}>
              <div className={s.benefit}>
                <div className={s.benefitIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className={s.benefitText}>
                  <span className={s.benefitTitle}>Free forever</span>
                  <span className={s.benefitDesc}>No credit card required</span>
                </div>
              </div>
              <div className={s.benefit}>
                <div className={s.benefitIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className={s.benefitText}>
                  <span className={s.benefitTitle}>Setup in 2 minutes</span>
                  <span className={s.benefitDesc}>Quick and easy onboarding</span>
                </div>
              </div>
              <div className={s.benefit}>
                <div className={s.benefitIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className={s.benefitText}>
                  <span className={s.benefitTitle}>Privacy first</span>
                  <span className={s.benefitDesc}>Your data stays yours</span>
                </div>
              </div>
            </div>
          </div>

          <div className={s.brandFooter}>
            <div className={s.avatars}>
              <div className={s.avatar} style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>S</div>
              <div className={s.avatar} style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>M</div>
              <div className={s.avatar} style={{ background: 'linear-gradient(135deg, #22C55E, #4ADE80)' }}>J</div>
              <div className={s.avatar} style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>K</div>
              <div className={s.avatar} style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}>+9K</div>
            </div>
            <p className={s.joinText}>Join 10,000+ people already using LifeOS</p>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className={s.formPanel}>
          <div className={s.formContainer}>
            <div className={s.formHeader}>
              <h2 className={s.formTitle}>Create your account</h2>
              <p className={s.formSubtitle}>Start organizing your life today</p>
            </div>

            {/* Social Register */}
            <div className={s.socialButtons}>
              <button className={s.socialBtn} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button className={s.socialBtn} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className={s.divider}>
              <span className={s.dividerLine} />
              <span className={s.dividerText}>or continue with email</span>
              <span className={s.dividerLine} />
            </div>

            <form className={s.form} onSubmit={handleSubmit(onSubmitRegister)}>
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="reg-name">Full name</label>
                <div className={s.inputWrapper}>
                  <div className={s.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    className={s.input}
                    placeholder="John Doe"
                    {...register('username')}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="reg-email">Email address</label>
                <div className={s.inputWrapper}>
                  <div className={s.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    className={s.input}
                    placeholder="you@example.com"
                    {...register('email')}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="reg-password">Password</label>
                <div className={s.inputWrapper}>
                  <div className={s.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className={s.input}
                    placeholder="Create a strong password"
                    {...register('password')}
                    onChange={(e) => {
                      register('password').onChange(e);
                      setPassword(e.target.value);
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={s.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {password && (
                  <div className={s.strengthMeter}>
                    <div className={s.strengthBars}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={s.strengthBar}
                          style={{
                            background: i <= strength.level ? strength.color : 'var(--bg-elevated)',
                          }}
                        />
                      ))}
                    </div>
                    <span className={s.strengthLabel} style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <button type="submit" className={s.submitBtn} disabled={isLoading}>
                {isLoading ? (
                  <div className={s.spinner}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                    </svg>
                  </div>
                ) : (
                  <>
                    Create account
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className={s.switchText}>
              Already have an account?{' '}
              <a
                href="#"
                className={s.switchLink}
                onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('login'); }}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
