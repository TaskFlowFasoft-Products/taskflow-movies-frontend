import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles/styles.module.css";
import { login, isAuthenticated } from "../../api/authService";
import RegisterModal from "./RegisterModal"; 
import { register } from "../../api/registerService";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [registerErrorMsg, setRegisterErrorMsg] = useState("");
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/boards");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await login(email, password);

      if (response.success) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("expires_at", response.expires_at);
        if (response.username) {
          localStorage.setItem("username", response.username);
        }
        navigate("/boards");
      } else {
        setErrorMsg(response.message || "Falha na autenticação.");
        setPassword(""); 
      }
    } catch {
      setErrorMsg("Erro ao tentar fazer login. Tente novamente.");
      setPassword(""); 
    } finally {
      setLoading(false);
    }
  };

  
  const handleRegisterSubmit = async (username, email, password) => {
    const response = await register(username, email, password);
    
    if (response.success) {
      setRegisterSuccessMsg(response.message);
      setRegisterErrorMsg(""); 
      setShowModal(false);
    } else {
      setRegisterErrorMsg(response.message || "Erro no cadastro.");
      setRegisterSuccessMsg("");  
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>

        {errorMsg && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "-1rem" }}>
            {errorMsg}
          </p>
        )}

        <div className={styles.buttonsContainer}>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={styles.registerButton}
          >
            Registrar
          </button>
        </div>

        <div className={styles.forgotPassword}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Esqueci minha senha
          </Link>
        </div>
      </form>

      {/* Modal de registro exibido condicionalmente */}
      {showModal && <RegisterModal onClose={() => setShowModal(false)} onRegisterSubmit={handleRegisterSubmit} />}

      {/* Exibindo mensagens de erro ou sucesso no registro */}
      {registerErrorMsg && (
        <p style={{ color: "red", fontSize: "0.9rem", marginTop: "-1rem" }}>
          {registerErrorMsg}
        </p>
      )}

      {registerSuccessMsg && (
        <p style={{ color: "green", fontSize: "0.9rem", marginTop: "-1rem" }}>
          {registerSuccessMsg}
        </p>
      )}
    </div>
  );
};

export default LoginForm;