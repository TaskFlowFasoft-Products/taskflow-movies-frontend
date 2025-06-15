import { useState } from "react";
import styles from "./styles/registerModal.module.css";
import { register } from "../../api/registerService";

const RegisterModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await register(name, email, password);
    setIsSuccess(response.success);
    setMessage(response.message);
    setLoading(false);

    if (response.success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Registre-se</h2>

        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p
              style={{
                color: isSuccess ? "green" : "red",
                fontSize: "0.95rem",
                marginTop: "-0.5rem",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar-se"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;