import React, { useState } from 'react';
import BoardWorkspace from '../../core/pages/boards/BoardWorkspace';
import { getBoards, createBoard as originalCreateBoard, deleteBoard, updateBoard } from '../../services/boardService';
import { getBoardColumns, createColumn, updateColumn, deleteColumn } from '../../core/api/columnService';
import { getTasks, createTask, updateTask, deleteTask } from '../../core/api/taskService';
import TemplateSelector from './components/TemplateSelector';
import styles from './components/styles/modal-overlay.module.css';
import { toast } from 'react-toastify';

const MoviesBoardWorkspace = () => {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [boardRefreshKey, setBoardRefreshKey] = useState(0);

  // Esta função será chamada pelo TemplateSelector quando um template for selecionado
  const handleSelectTemplate = async (id) => {
    console.log("Criando quadro com ID:", id);
    try {
      const result = await originalCreateBoard(id);
      if (result.success) {
        setShowTemplateSelector(false);
        setBoardRefreshKey(prevKey => prevKey + 1);
        toast.success("Quadro criado com sucesso!");
      } else {
        toast.error(result.message || "Erro ao criar quadro.");
      }
      return result;
    } catch (error) {
      console.error('Erro ao criar quadro:', error);
      toast.error(error.response?.data?.message || "Erro ao criar quadro.");
      return { success: false, message: 'Erro ao criar quadro' };
    }
  };

  // Esta função será chamada quando o botão "Novo Quadro" do BoardWorkspace for clicado
  const handleCoreCreateBoardClick = () => {
    console.log("Botão Novo Quadro do core clicado. Abrindo TemplateSelector...");
    setShowTemplateSelector(true);
  };

  const boardService = {
    getBoards,
    createBoard: handleSelectTemplate, // Agora, o boardService.createBoard é a função que cria com template
    deleteBoard,
    updateBoard
  };

  const columnService = {
    getBoardColumns,
    createColumn,
    updateColumn,
    deleteColumn,
  };

  const taskService = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  };

  return (
    <>
      <BoardWorkspace
        key={boardRefreshKey}
        boardService={boardService}
        columnService={columnService}
        taskService={taskService}
        allowAddBoard={true}
        onCoreCreateBoardClick={handleCoreCreateBoardClick}
        refreshTrigger={boardRefreshKey}
        allowAddColumn={false}
        allowEditColumn={false}
        allowDeleteColumn={false}
        allowEditBoard={false}
        allowDeleteBoard={true}
      />

      {showTemplateSelector && (
        <div className={styles['modal-overlay']}>
          <TemplateSelector
            onSelect={handleSelectTemplate}
            onClose={() => setShowTemplateSelector(false)}
          />
        </div>
      )}
    </>
  );
};

export default MoviesBoardWorkspace; 