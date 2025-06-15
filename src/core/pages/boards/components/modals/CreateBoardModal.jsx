import { useState } from "react";
import styles from "./styles/createBoardModal.module.css";

const CreateBoardModal = ({ onClose, onCreate, loading }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const validateName = (value) => {
    if (!value || value.trim() === '') {
      setNameError("O nome do quadro é obrigatório");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateName(name)) {
      return;
    }
  
    onCreate({ 
      name: name.trim(),
      columns: [] 
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Novo Quadro</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome do Quadro*</label>
            <input
              type="text"
              className={`${styles.input} ${nameError ? styles.inputError : ''}`}
              placeholder="Nome do quadro"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              onBlur={(e) => validateName(e.target.value)}
              required
              autoFocus
            />
            {nameError && <span className={styles.errorMessage}>{nameError}</span>}
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.createButton} disabled={!name.trim() || loading}>
              {loading ? "Salvando..." : "Criar Quadro"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
