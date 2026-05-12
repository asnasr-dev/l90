import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ADMIN_GATE_KEY } from "../constants";
import { setAdminSession } from "../storage";
import { ADMIN_PASS, ADMIN_USER } from "../types";
import styles from "./AdminGate.module.css";

export function AdminGate() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  if (sessionStorage.getItem(ADMIN_GATE_KEY) !== "1") {
    return <Navigate to="/" replace />;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setErr(false);
      setAdminSession(true);
      sessionStorage.removeItem(ADMIN_GATE_KEY);
      navigate("/admin/panel", { replace: true });
    } else {
      setErr(true);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.card}>
        <p className={styles.kicker}>Restricted</p>
        <h1 className={styles.title}>Admin access</h1>
        <p className={styles.lede}>
          You unlocked this route via the logo sequence. Sign in to manage inventory,
          media, reviews, and outbound checkout links.
        </p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.lbl}>
            Operator ID
            <input
              className={styles.input}
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </label>
          <label className={styles.lbl}>
            Passphrase
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>
          {err && <p className={styles.error}>Credentials did not match.</p>}
          <button type="submit" className={styles.submit}>
            Enter control room
          </button>
        </form>
      </div>
    </div>
  );
}
