import { useState } from "react";
import styles from "./styles/createColumnModal.module.css";

const CreateColumnModal = ({ onClose, onCreate, loading }) => {
  const [columnName, setColumnName] = useState("");
  const [columnNameError, setColumnNameError] = useState("");

  const validateColumnName = (value) => {
      if (!value || value.trim() === '') {
          setColumnNameError("O nome da coluna é obrigatório");
          return false;
      }
      setColumnNameError("");
      return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateColumnName(columnName)) {
      onCreate(columnName.trim());
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Nova Coluna</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="columnName" className={styles.label}>
            Nome da Coluna*
          </label>
          <input
            type="text"
            id="columnName"
            className={`${styles.input} ${columnNameError ? styles.inputError : ''}`}
            value={columnName}
            onChange={(e) => {
                setColumnName(e.target.value);
                if (e.target.value.trim()) setColumnNameError("");
            }}
            onBlur={(e) => validateColumnName(e.target.value)}
            placeholder="Digite o nome da coluna"
            required
            autoFocus
          />
          {columnNameError && <span className={styles.errorMessage}>{columnNameError}</span>}

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={!columnName.trim() || loading}>
              {loading ? "Salvando..." : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnModal;
