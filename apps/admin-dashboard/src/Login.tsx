import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, Smartphone, KeyRound } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { email: string; role: 'owner' | 'employee'; name: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for Reset Password Flow
  const [mode, setMode] = useState<'login' | 'reset-email' | 'reset-otp' | 'reset-email-sent' | 'reset-new'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Mock Authentication Logic
    if (email === 'owner@satyabhama.com' && password === 'admin123') {
      onLogin({ email, role: 'owner', name: 'Satyabhama Director' });
    } else if (email === 'employee@satyabhama.com' && password === 'staff123') {
      onLogin({ email, role: 'employee', name: 'Store Staff' });
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (resetEmail === 'owner@satyabhama.com') {
      // Owner requires SMS OTP Authentication
      setMode('reset-otp');
    } else if (resetEmail === 'employee@satyabhama.com') {
      // Show simulated email sent state
      setMode('reset-email-sent');
    } else {
      setError('Account not found.');
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (otp === '123456') { // Mock OTP
      setMode('reset-new');
    } else {
      setError('Invalid SMS Code. Hint: Use 123456');
    }
  };

  const handleNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Password successfully reset! You can now log in.');
    setMode('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-6 font-sans">
      <div className="w-full max-w-md bg-stone-900/40 backdrop-blur-xl p-10 rounded-2xl border border-stone-800 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150px] bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-serif text-amber-200 tracking-widest uppercase mb-2">Satyabhama Admin</h1>
            <p className="text-stone-400 text-xs tracking-widest uppercase">
              {mode === 'login' ? 'Secure Authentication' : 'Account Recovery'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-900/50 rounded text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-emerald-900/30 border border-emerald-900/50 rounded text-emerald-400 text-xs text-center">
              {success}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded py-3 pl-12 pr-4 text-stone-200 focus:outline-none focus:border-amber-500 transition text-sm"
                    placeholder="Enter assigned email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase tracking-widest text-stone-500 block">Password</label>
                  <button type="button" onClick={() => { setMode('reset-email'); setError(''); }} className="text-[10px] text-amber-500 hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded py-3 pl-12 pr-4 text-stone-200 focus:outline-none focus:border-amber-500 transition text-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 text-black py-4 rounded font-bold tracking-widest uppercase text-xs hover:bg-amber-400 transition mt-4">
                Authenticate
              </button>
              
              <div className="mt-6 border-t border-stone-800 pt-6 text-center">
                 <p className="text-[10px] text-stone-500 mb-2 uppercase tracking-wider">Demo Credentials</p>
                 <p className="text-xs text-stone-400">Owner: owner@satyabhama.com / admin123</p>
                 <p className="text-xs text-stone-400 mt-1">Employee: employee@satyabhama.com / staff123</p>
              </div>
            </form>
          )}

          {mode === 'reset-email' && (
            <form onSubmit={handleResetRequest} className="flex flex-col gap-6">
              <p className="text-sm text-stone-400 text-center leading-relaxed">
                Enter your email address. If you are an Owner, you will be required to verify via an SMS code sent to your registered Indian mobile number (+91).
              </p>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded py-3 pl-12 pr-4 text-stone-200 focus:outline-none focus:border-amber-500 transition text-sm"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-stone-800 text-stone-200 py-4 rounded font-bold tracking-widest uppercase text-xs hover:bg-amber-500 hover:text-black transition mt-4 flex items-center justify-center gap-2">
                Continue <ArrowRight size={14} />
              </button>
              <button type="button" onClick={() => setMode('login')} className="text-xs text-stone-500 hover:text-stone-300">
                Back to Login
              </button>
            </form>
          )}

          {mode === 'reset-email-sent' && (
            <div className="flex flex-col gap-6 text-center">
              <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                <Mail className="text-amber-500" size={32} />
              </div>
              <h2 className="text-stone-200 font-serif text-xl tracking-wide">Link Sent Successfully!</h2>
              <p className="text-sm text-stone-400 leading-relaxed px-4">
                We've sent a password reset link to <strong>{resetEmail}</strong>. Please check your inbox.
              </p>
              
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg mt-4 text-left">
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Demo Simulation</p>
                <p className="text-xs text-stone-400 mb-4">In a real app, the employee would click the link in their email. For this demo, click below to simulate opening that link.</p>
                <button 
                  onClick={() => setMode('reset-new')} 
                  className="w-full bg-stone-800 text-stone-300 py-3 rounded font-medium text-xs hover:bg-amber-500 hover:text-black transition border border-stone-700"
                >
                  Simulate Email Link Click
                </button>
              </div>

              <button type="button" onClick={() => setMode('login')} className="text-xs text-stone-500 hover:text-stone-300 mt-2">
                Return to Login
              </button>
            </div>
          )}

          {mode === 'reset-otp' && (
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
              <div className="text-center">
                 <ShieldCheck className="mx-auto text-emerald-500 mb-4" size={32} />
                 <p className="text-sm text-stone-300 leading-relaxed mb-2">
                   Owner Authentication Required.
                 </p>
                 <p className="text-xs text-stone-500">
                   An SMS OTP has been sent to +91 98****4321
                 </p>
              </div>
              <div>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded py-3 pl-12 pr-4 text-center text-stone-200 focus:outline-none focus:border-emerald-500 transition text-lg tracking-[0.5em] font-mono"
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-stone-100 py-4 rounded font-bold tracking-widest uppercase text-xs hover:bg-emerald-500 transition mt-4 flex items-center justify-center gap-2">
                Verify SMS Code
              </button>
              <button type="button" onClick={() => setMode('login')} className="text-xs text-stone-500 hover:text-stone-300">
                Cancel
              </button>
            </form>
          )}

          {mode === 'reset-new' && (
             <form onSubmit={handleNewPassword} className="flex flex-col gap-6">
              <div className="text-center">
                 <KeyRound className="mx-auto text-amber-500 mb-4" size={32} />
                 <p className="text-sm text-stone-300 leading-relaxed">
                   Enter your new secure password.
                 </p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                  <input 
                    type="password" 
                    className="w-full bg-stone-950 border border-stone-800 rounded py-3 pl-12 pr-4 text-stone-200 focus:outline-none focus:border-amber-500 transition text-sm"
                    placeholder="New password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 text-black py-4 rounded font-bold tracking-widest uppercase text-xs hover:bg-amber-400 transition mt-4 flex items-center justify-center gap-2">
                Save & Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
