import { useEffect, useState } from "react";
import styles from "./styles/renameBoardModal.module.css";

const RenameBoardModal = ({ boardName, onClose, onConfirm, loading }) => {
  const [name, setName] = useState(boardName || "");
  const [nameError, setNameError] = useState("");

  const validateName = (value) => {
      if (!value || value.trim() === '') {
          setNameError("O nome do quadro é obrigatório");
          return false;
      }
      setNameError("");
      return true;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (validateName(name)) {
          onConfirm(name.trim());
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [name, onClose, onConfirm]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Renomear Quadro</h2>
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
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
              className={styles.confirmBtn}
              onClick={() => {
                  if (validateName(name)) {
                      onConfirm(name.trim());
                  }
              }}
              disabled={!name.trim() || loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameBoardModal;
