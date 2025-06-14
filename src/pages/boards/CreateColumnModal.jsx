import React, { useState } from "react";
import styles from "./styles/createColumnModal.module.css";

const CreateColumnModal = ({ isOpen, onClose, onSave }) => {
  const [columnName, setColumnName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!columnName.trim()) return;

    setIsSaving(true);
    try {
      await onSave(columnName);
      onClose(); 
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Criar Nova Coluna</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="columnName">Nome da Coluna</label>
          <input
            type="text"
            id="columnName"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Digite o nome da coluna"
              disabled={isSaving}
              required
          />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving || !columnName.trim()}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnModal;