import styles from "./styles/deleteConfirmModal.module.css";

const DeleteColumnConfirmModal = ({ columnName, onCancel, onConfirm, loading }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Excluir Coluna</h2>
        <p>
          Você tem certeza que deseja excluir <strong>{columnName}</strong>?
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm} disabled={loading}>
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteColumnConfirmModal;
