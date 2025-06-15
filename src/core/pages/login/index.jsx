import LoginForm from "./LoginForm";
import styles from "./styles/styles.module.css";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <div className={styles.logoSection}>
          <img src={logo} alt="TaskFlow Logo" className={styles.logoImage} />
        </div>

        <div className={styles.divider}></div>

        <div className={styles.formSection}>
          <div className={styles.formContent}>
            <h2 className={styles.title}>Login</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
