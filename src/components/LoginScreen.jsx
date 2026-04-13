import { useState } from 'react';

export function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('先输入一个名字。');
      return;
    }

    onLogin(trimmedName);
  };

  return (
    <main className="login-shell">
      <section className="login-card card">
        <p className="eyebrow">fotd</p>
        <h1>创建你的账号</h1>
        <p className="login-copy">
          这个名字只会保存在你的浏览器里。输入后就可以进入你的打卡厨房。
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input
              autoFocus
              maxLength="24"
              placeholder="比如 Nana"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-button" type="submit">
            Start playing
          </button>
        </form>
      </section>
    </main>
  );
}
