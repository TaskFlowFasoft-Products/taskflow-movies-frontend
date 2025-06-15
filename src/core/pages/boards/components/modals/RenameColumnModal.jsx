import { useState, useEffect } from "react";
import styles from "./styles/renameBoardModal.module.css";

const RenameColumnModal = ({ columnName, onClose, onConfirm, loading }) => {
  const [name, setName] = useState(columnName);
  const [nameError, setNameError] = useState("");

  const validateName = (value) => {
      if (!value || value.trim() === '') {
          setNameError("O nome da coluna é obrigatório");
          return false;
      }
      setNameError("");
      return true;
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") {
        if (validateName(name)) {
          onConfirm(name.trim());
        }
      } else if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [name, onConfirm, onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Renomear Coluna</h2>
        <label className={styles.label}>Novo nome*</label>
        <input
          className={`${styles.input} ${nameError ? styles.inputError : ''}`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError("");
          }}
          onBlur={(e) => validateName(e.target.value)}
          placeholder="Novo nome"
          autoFocus
          required
        />
        {nameError && <span className={styles.errorMessage}>{nameError}</span>}

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
          <button
              onClick={() => {
                  if (validateName(name)) {
                      onConfirm(name.trim());
                  }
              }}
              className={styles.confirmBtn}
              disabled={!name.trim() || loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameColumnModal;
