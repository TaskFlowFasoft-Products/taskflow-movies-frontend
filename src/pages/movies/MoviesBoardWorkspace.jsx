import React from 'react';
import BoardWorkspace from '../../core/pages/boards/BoardWorkspace';
import { getBoards, createBoard, deleteBoard, updateBoard } from '../../services/boardService';

const MoviesBoardWorkspace = () => {
  const boardService = {
    getBoards,
    createBoard,
    deleteBoard,
    updateBoard
  };

  return (
    <BoardWorkspace
      boardService={boardService}
      allowAddColumn={true}
      allowAddBoard={true}
      allowEditColumn={true}
      allowDeleteColumn={true}
      allowEditBoard={true}
      allowDeleteBoard={true}
    />
  );
};

export default MoviesBoardWorkspace; 