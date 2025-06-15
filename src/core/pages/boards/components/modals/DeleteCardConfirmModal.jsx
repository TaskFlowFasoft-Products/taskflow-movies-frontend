import styles from "./styles/deleteCardConfirmModal.module.css";

const DeleteCardConfirmModal = ({ cardTitle, onCancel, onConfirm, loading }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.modalTitle}>Confirmar Exclusão</h3>
                <p className={styles.modalMessage}>
                    Tem certeza que deseja excluir o cartão <strong>{cardTitle}</strong>?
                </p>
                <div className={styles.buttonGroup}>
                    <button onClick={onCancel} className={styles.cancelButton} disabled={loading}>
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton} disabled={loading}>
                        {loading ? "Excluindo..." : "Excluir"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCardConfirmModal;
