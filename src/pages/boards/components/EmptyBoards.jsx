import styles from "./styles/emptyBoards.module.css";
import { FaRegFolderOpen } from "react-icons/fa";

const EmptyBoards = ({ onCreateBoard }) => {
  return (
    <div className={styles.emptyContainer}>
      <FaRegFolderOpen className={styles.icon} />
      <h2>Nenhum quadro encontrado</h2>
      <p>Crie um quadro para começar a organizar suas tarefas.</p>
      <button className={styles.createBtn} onClick={onCreateBoard}>
        + Criar novo quadro
      </button>
    </div>
  );
};

export default EmptyBoards;
