import { useState, useRef, useEffect } from "react";
import styles from "./styles/boardWorkspace.module.css";
import { useNavigate } from "react-router-dom";
import CreateBoardModal from "./components/modals/CreateBoardModal";
import CreateColumnModal from "./components/modals/CreateColumnModal";
import RenameBoardModal from "./components/modals/RenameBoardModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import RenameColumnModal from "./components/modals/RenameColumnModal";
import DeleteCardConfirmModal from "./components/modals/DeleteCardConfirmModal";
import CreateCardModal from "./components/modals/CreateCardModal";
import DeleteColumnConfirmModal from "./components/modals/DeleteColumnConfirmModal";
import { getBoards } from "../../api/boardService";
import MenuPortal from "../../components/MenuPortal";
import {
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaEllipsisH,
  FaTrashAlt,
  FaPen,
} from "react-icons/fa";
import LogoIcon from "../../assets/Logo Icone.png";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { createBoard } from "../../api/boardService";
import { deleteBoard } from "../../api/boardService"; 
import { updateBoard } from "../../api/boardService";
import { createColumn } from "../../api/columnService";
import { updateColumn } from "../../api/columnService";
import { deleteColumn } from "../../api/columnService";
import { getBoardColumns } from "../../api/columnService";
import { createTask } from "../../api/taskService";
import { updateTask } from "../../api/taskService";
import { deleteTask } from "../../api/taskService";


const BoardWorkspace = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false);
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [columnToRename, setColumnToRename] = useState(null);
  const [columnMenu, setColumnMenu] = useState(null);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [columnToDeleteIndex, setColumnToDeleteIndex] = useState(null);
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const [columnToAddCard, setColumnToAddCard] = useState(null);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [showDeleteCardConfirmModal, setShowDeleteCardConfirmModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const [isSavingCard, setIsSavingCard] = useState(false);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isRenamingBoard, setIsRenamingBoard] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isRenamingColumn, setIsRenamingColumn] = useState(false);

  const [isDeletingBoard, setIsDeletingBoard] = useState(false);
  const [isDeletingColumn, setIsDeletingColumn] = useState(false);
  const [isDeletingCard, setIsDeletingCard] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const userDropdownRef = useRef(null);
  const columnDropdownRef = useRef(null);
  const boardDropdownRef = useRef(null);

  const [loggedInUserName, setLoggedInUserName] = useState("Carregando...");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setLoggedInUserName(storedUsername);
    } else {
      setLoggedInUserName("Usuário");
    }
  }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      const data = await getBoards();
  
      const normalizedBoards = data.map((board) => ({
        ...board,
        id: String(board.id),
        columns: board.columns.map((column) => ({
          ...column,
          id: String(column.id),
          cards: column.cards.map((card) => ({
            ...card,
            id: String(card.id),
          })),
        })),
      }));
  
      setBoards(normalizedBoards);
      setLoading(false);
    };
  
    fetchBoards();
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setActiveMenuIndex(null);
        setUserMenuOpen(false);
      }

      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target)
      ) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (!sidebarOpen) {
      setActiveMenuIndex(null);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target)) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const confirmDeleteColumn = (colIndex) => {
    setColumnToDeleteIndex(colIndex);
    setShowDeleteColumnModal(true);
  };

  const handleConfirmDeleteColumn = async () => {
    const board = boards[selectedBoardIndex];
    const column = board.columns[columnToDeleteIndex];
  
    if (!board || !column) {
        toast.error("Erro interno ao tentar excluir coluna. Por favor, tente novamente.");
        setShowDeleteColumnModal(false);
        setColumnMenu(null);
        return;
    }
  
    setIsDeletingColumn(true);
  
    try {
        const result = await deleteColumn(board.id, column.id);
    
        if (result.success) {
          setBoards((prevBoards) => {
            const updatedBoards = structuredClone(prevBoards);
            updatedBoards[selectedBoardIndex].columns = updatedBoards[selectedBoardIndex].columns.filter(
              (_, index) => index !== columnToDeleteIndex
            );
            return updatedBoards;
          });
          toast.success("Coluna excluída com sucesso!");
        } else {
          toast.error(result.message || "Erro ao excluir coluna.");
        }
    } catch (error) {
        toast.error("Erro ao excluir coluna.");
    } finally {
        setShowDeleteColumnModal(false);
        setColumnMenu(null);
        setIsDeletingColumn(false);
    }
  };


  const openRenameColumnModal = (colIndex) => {
    const currentBoardIndex = selectedBoardIndex;
    if (currentBoardIndex === null) return;

    setColumnToRename(colIndex);
    setShowRenameColumnModal(true);
    setColumnMenu(null); 
  };

  const handleConfirmRenameColumn = async (newName) => {
    const currentBoardIndex = selectedBoardIndex; 
    const colIndex = columnToRename;

    if (currentBoardIndex === null || colIndex === null || !boards[currentBoardIndex] || !boards[currentBoardIndex].columns[colIndex]) {
        toast.error("Erro interno ao tentar renomear coluna. Por favor, tente novamente.");
        setShowRenameColumnModal(false);
        return;
    }

    const board = boards[currentBoardIndex];
    const column = board.columns[colIndex];

    setIsRenamingColumn(true);
  
    const result = await updateColumn(board.id, column.id, newName);
  
    if (result.success) {
      setBoards((prev) => {
        const updated = structuredClone(prev);
        updated[currentBoardIndex].columns[colIndex].title = newName;
        return updated;
      });
      toast.success("Coluna renomeada com sucesso!");
    } else {
      toast.error(result.message || "Erro ao renomear coluna.");
    }
  
    setShowRenameColumnModal(false);
    setIsRenamingColumn(false);
  };
  

  const handleCreateBoard = async (newBoard) => {
    const { name } = newBoard;

    setIsCreatingBoard(true);

    try {
      const result = await createBoard(name);

      if (result.success) {
        setBoards((prev) => [...prev, result.board]);
        toast.success("Quadro criado com sucesso!");
      } else {
        toast.error(result.message || "Erro ao criar quadro.");
      }
    } catch (error) {
        const errorMessage = error.response?.data?.detail || "Erro ao criar quadro.";
        toast.error(errorMessage);
    } finally {
        setIsCreatingBoard(false);
        setShowModal(false);
    }
  };
  

  const handleMenuToggle = (index, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.top, left: rect.right + 8 });
    setActiveMenuIndex((prev) => (prev === index ? null : index));
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
    setActiveMenuIndex(null);
  };

  const handleRename = (index) => {
    setRenameIndex(index);
    setShowRenameModal(true);
    setActiveMenuIndex(null);
  };

  const confirmDeleteBoard = async () => {
    const boardId = boards[deleteIndex]?.id;

    if (!boardId) {
        toast.error("Erro: ID do quadro não encontrado para exclusão.");
        setShowDeleteModal(false);
        return;
    }

    setIsDeletingBoard(true);

    try {
        const result = await deleteBoard(boardId);
    
        if (result.success) {
          setBoards((prev) => prev.filter((_, i) => i !== deleteIndex));
          if (selectedBoardIndex === deleteIndex) {
            setSelectedBoardIndex(null);
          }
          toast.success("Quadro excluído com sucesso!");
        } else {
          toast.error(result.message || "Erro ao excluir quadro.");
        }
    } catch (error) {
        toast.error("Erro ao excluir quadro.");
    } finally {
        setShowDeleteModal(false);
        setIsDeletingBoard(false);
    }
  };
  

  const handleConfirmRename = async (newName) => {
    const board = boards[renameIndex];

    setIsRenamingBoard(true);

    const result = await updateBoard(board.id, newName);
  
    if (result.success) {
      setBoards((prev) => {
        const updated = [...prev];
        updated[renameIndex].name = newName;
        return updated;
      });
      toast.success("Quadro renomeado com sucesso!");
    } else {
      toast.error(result.message || "Erro ao renomear quadro.");
    }
  
    setRenameIndex(null);
    setShowRenameModal(false);
    setIsRenamingBoard(false);
  };
  

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    setUserMenuOpen(false);
    navigate("/login");
  };

  const handleCreateColumn = async (columnName) => {
    if (selectedBoardIndex === null) return; 

    const board = boards[selectedBoardIndex];

    setIsCreatingColumn(true);

    try {
      const result = await createColumn(board.id, columnName);

      if (result.success && result.column) {
        const normalizedColumn = {
          ...result.column,
          id: String(result.column.id),
          cards: [],
        };

        setBoards((prevBoards) => {
          const updated = structuredClone(prevBoards);
          updated[selectedBoardIndex].columns.push(normalizedColumn);
          return updated;
        });

        toast.success("Coluna criada com sucesso!");
      } else {
        const errorMessage = result.message || "Erro desconhecido ao criar coluna.";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Erro ao criar coluna.";
      toast.error(errorMessage);
    } finally {
      setIsCreatingColumn(false);
      setShowCreateColumnModal(false); 
    }
  }; 

  const handleCreateCardClick = (colIndex) => {
    setColumnToAddCard(colIndex);
    setShowCreateCardModal(true);
  };

  const handleCreateCard = async (cardData) => {
    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];
  
    setIsSavingCard(true);

    try {
      if (!cardData.title || cardData.title.trim() === '') {
        toast.error('O título do cartão é obrigatório');
        setIsSavingCard(false);
        return;
      }

      if (cardData.id) {
        let columnIndex = cardData.columnIndex;
        if (columnIndex === undefined || columnIndex === null) {
          columnIndex = board.columns.findIndex((col) =>
            col.cards.some((card) => card.id === cardData.id)
          );
        }
        
        if (columnIndex === -1) {
          toast.error("Coluna do cartão não encontrada.");
          return;
        }
        
        const currentColumnId = board.columns[columnIndex].id;

        const payload = {
          board_id: Number(board.id.toString().replace('col-', '')),
          column_id: Number(currentColumnId.replace('col-', '')),
          old_column_id: Number(currentColumnId.replace('col-', '')),
          task_id: Number(cardData.id.toString().replace('card-', '')),
          title: cardData.title,
          description: cardData.description,
          due_date: cardData.dueDate === '' ? null : cardData.dueDate,
        };

        await updateTask(payload);
  
        const cards = board.columns[columnIndex].cards;
        const cardIndex = cards.findIndex((c) => c.id === cardData.id);
  
        if (cardIndex !== -1) {
          cards[cardIndex] = {
            ...cards[cardIndex],
            title: cardData.title,
            description: cardData.description,
            dueDate: cardData.dueDate,
          };
          toast.success("Cartão atualizado com sucesso!");
        } else {
          toast.warn("Cartão não encontrado para atualização.");
        }
  
      } else {
        const columnIndex = columnToAddCard;
        const payload = {
          board_id: Number(board.id.toString().replace('col-', '')),
          column_id: Number(board.columns[columnIndex].id.replace('col-', '')),
          title: cardData.title,
          description: cardData.description,
          due_date: cardData.dueDate === '' ? null : cardData.dueDate,
        };
  
        const created = await createTask(payload);
  
        const newCard = {
          id: String(created.id),
          title: created.title,
          description: created.description,
          dueDate: created.due_date,
          createdAt: created.created_at,
        };
  
        board.columns[columnIndex].cards.push(newCard);
        toast.success("Cartão criado com sucesso!");
      }
  
      setBoards(updatedBoards);
      setCardToEdit(null);
      setShowCreateCardModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Erro ao salvar o cartão.";
      toast.error(errorMessage);
    } finally {
      setIsSavingCard(false);
      setShowCreateCardModal(false);
    }
  };
  


  const handleDeleteCard = (card) => {
    setCardToDelete(card);
    setShowDeleteCardConfirmModal(true);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete || cardToDelete.columnIndex === undefined || cardToDelete.id === undefined) {
        toast.error("Erro interno ao tentar excluir cartão. Por favor, tente novamente.");
        setCardToDelete(null);
        setShowDeleteCardConfirmModal(false);
        setShowCreateCardModal(false);
        setCardToEdit(null);
        return;
    }

    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];
    const columnIndex = cardToDelete.columnIndex;

     if (!board || !board.columns || !board.columns[columnIndex]) {
        toast.error("Erro interno ao tentar excluir cartão. Por favor, tente novamente.");
        setCardToDelete(null);
        setShowDeleteCardConfirmModal(false);
        setShowCreateCardModal(false);
        setCardToEdit(null); 
        return;
    }
  
    setIsDeletingCard(true);

    try {
      const payload = {
        board_id: Number(board.id.toString().replace('col-', '')),
        column_id: Number(board.columns[columnIndex].id.replace('col-', '')),
        task_id: Number(cardToDelete.id.toString().replace('card-', '')), 
      };
  
      await deleteTask(payload);
  
      board.columns[columnIndex].cards = board.columns[columnIndex].cards.filter(
        (c) => c.id !== cardToDelete.id
      );
  
      setBoards(updatedBoards);
      toast.success("Cartão excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir o cartão.");
    } finally {
      setCardToDelete(null);
      setShowDeleteCardConfirmModal(false);
      setShowCreateCardModal(false); 
      setCardToEdit(null); 
      setIsDeletingCard(false);
    }
  };  

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const updatedBoards = structuredClone(boards);
    const board = updatedBoards[selectedBoardIndex];

    const sourceColId = Number(source.droppableId.replace('col-', ''));
    const destColId = Number(destination.droppableId.replace('col-', ''));

    const sourceColIndex = board.columns.findIndex(
      (col) => Number(col.id.replace('col-', '')) === sourceColId
    );
    const destColIndex = board.columns.findIndex(
      (col) => Number(col.id.replace('col-', '')) === destColId
    );

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = board.columns[sourceColIndex];
    const destCol = board.columns[destColIndex];

    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    if (!movedCard) return;

    movedCard.column_id = Number(destColId); 

    destCol.cards.splice(destination.index, 0, movedCard);

    setBoards(updatedBoards);


    if (sourceColId !== destColId) {
      try {
        const cardId = Number(movedCard.id.replace('card-', ''));
        const oldColumnIdToSend = Number(source.droppableId.replace('col-', ''));

        await updateTask({
          board_id: Number(board.id),
          task_id: cardId,
          old_column_id: oldColumnIdToSend,
          column_id: Number(destColId), 
          title: movedCard.title ?? '',
          description: movedCard.description ?? '',
          due_date: movedCard.dueDate ?? null,
        });
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Erro desconhecido ao mover o card.';
        toast.error(`Não foi possível mover o card: ${errorMessage}`);
        const revertedBoards = structuredClone(boards);
        setBoards(revertedBoards);
      }
    }
  };

  const handleSelectBoard = async (index) => {
    setSelectedBoardIndex(index);
  
    const board = boards[index];
    const columns = await getBoardColumns(board.id);

  
    const normalizedColumns = columns.map((col) => ({
      ...col,
      id: `col-${col.id}`, 
      cards: col.cards?.map((card) => ({
        ...card,
        id: `card-${card.id}`,
      })) || [],
    }));
  
    setBoards((prevBoards) => {
      const updated = [...prevBoards];
      updated[index].columns = normalizedColumns;
      return updated;
    });
  };  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        boardDropdownRef.current &&
        !boardDropdownRef.current.contains(event.target) &&
        activeMenuIndex !== null
      ) {
        const isToggleClick = event.target.closest(`.${styles.boardMenu}`) !== null;

        if (!boardDropdownRef.current.contains(event.target) && !isToggleClick) {
           setActiveMenuIndex(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownRef, userRef, boardDropdownRef, activeMenuIndex]);

  useEffect(() => {
    const handleClickOutsideColumnMenu = (e) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target)) {
        setColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideColumnMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideColumnMenu);
  }, [columnDropdownRef]);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div
            className={`${styles.logo} ${!sidebarOpen ? styles.logoHidden : ""
              }`}
          >
            <img
              src={LogoIcon}
              alt="TaskFlow Logo"
              className={styles.logoImage}
            />
          </div>
          <h1 className={styles.appName}>TaskFlow</h1>
        </div>

        <div className={styles.headerCenter}>
          {selectedBoardIndex !== null
            ? boards[selectedBoardIndex]?.name
            : "Nenhum quadro selecionado"}
        </div>

        <div className={styles.headerRight}>
          <div
            ref={userRef}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            <FaUserCircle size={29} color="#3a86ff" />
          </div>

          {userMenuOpen && (
            <MenuPortal>
              <div className={styles.userMenu} ref={userDropdownRef}>
                <div className={styles.userInfo}>
                  <span className={styles.userDisplayName}>{loggedInUserName}</span>
                </div>
                <div className={styles.menuDivider}></div>
                <button className={styles.userMenuItem} onClick={handleLogout}>
                  Fazer Logout
                </button>
              </div>
            </MenuPortal>
          )}
        </div>
      </header>

      <div className={styles.workspaceContainer}>
        <div
          className={`${styles.toggleContainer} ${sidebarOpen ? styles.open : styles.closed
            }`}
        >
          <button
            className={styles.toggleSidebarBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaChevronLeft size={16} />
            ) : (
              <FaChevronRight size={16} />
            )}
          </button>
        </div>

        <aside
          className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ""
            }`}
        >
          <h3 className={styles.sidebarTitle}>Task Workspace</h3>
          <div className={styles.sidebarSection}>
            <p className={styles.sectionLabel}>Meus Quadros</p>
            <ul className={styles.boardList}>
              {boards.map((board, index) => (
                <li
                  key={index}
                  className={`${styles.boardItem} ${selectedBoardIndex === index ? styles.activeBoard : ""
                    }`}
                >
<div
  className={styles.boardContent}
  onClick={() => handleSelectBoard(index)}
>
                    <span className={styles.pinIcon}>📌</span>
                    {board.name}
                  </div>
                  <div className={styles.boardMenu}>
                    <FaEllipsisH onClick={(e) => handleMenuToggle(index, e)} />
                  </div>
                  {activeMenuIndex === index && (
                    <MenuPortal>
                      <div
                        ref={boardDropdownRef}
                        className={styles.dropdownMenu}
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left,
                          position: "fixed",
                          zIndex: 9999,
                        }}
                      >
                        <button onClick={() => handleRename(index)}>
                          <FaPen size={12} /> Renomear
                        </button>
                        <button onClick={() => handleDelete(index)}>
                          <FaTrashAlt size={12} /> Excluir
                        </button>
                      </div>
                    </MenuPortal>
                  )}
                </li>
              ))}
            </ul>
            <button
              className={styles.addBoardBtn}
              onClick={() => setShowModal(true)}
            >
              <FaPlus size={12} style={{ marginRight: "6px" }} />
              Novo Quadro
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          {loading ? (
            <p>Carregando quadros...</p>
          ) : selectedBoardIndex === null ? (
            <h2>Selecione ou crie um quadro</h2>
          ) : (
            <div className={styles.boardView}>
              <h2 className={styles.boardTitle}>
                {boards[selectedBoardIndex]?.name}
              </h2>

              <DragDropContext onDragEnd={handleDragEnd}>
                <div className={styles.columnsArea}>
                  {boards[selectedBoardIndex]?.columns?.length > 0 ? (
                    <>
                      {boards[selectedBoardIndex].columns.map((column, colIndex) => {
                        return (
                          <Droppable droppableId={column.id} key={column.id}>
                            {(provided) => (
                              <div
                                className={styles.column}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                <div className={styles.columnHeader}>
                                  <h3 className={styles.columnTitle}>{column.title}</h3>
                                  <FaEllipsisH
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setColumnMenu({
                                        columnId: column.id,
                                        index: colIndex,
                                        top: rect.bottom,
                                        left: rect.left,
                                      });
                                    }}
                                    className={styles.columnMenuIcon}
                                  />
                                </div>

                                {columnMenu?.columnId === column.id && (
                                  <MenuPortal>
                                    <div
                                      ref={columnDropdownRef}
                                      className={styles.dropdownMenu}
                                      style={{
                                        top: columnMenu.top,
                                        left: columnMenu.left,
                                        position: "fixed",
                                        zIndex: 9999,
                                      }}
                                    >
                                      <button onClick={() => openRenameColumnModal(columnMenu.index)}>
                                        <FaPen size={12} style={{ marginRight: "6px" }} />
                                        Renomear
                                      </button>
                                      <button onClick={() => confirmDeleteColumn(columnMenu.index)}>
                                        <FaTrashAlt size={12} style={{ marginRight: "6px" }} />
                                        Excluir
                                      </button>
                                    </div>
                                  </MenuPortal>
                                )}

                                <div className={styles.columnContent}>
                                  {column.cards?.length > 0 ? (
                                    column.cards.map((card, cardIndex) => {
                                      if (!card) return null; 
                                      return (
                                        <Draggable draggableId={card.id} index={cardIndex} key={card.id}>
                                          {(provided) => (
                                            <div
                                              className={styles.card}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              onClick={() => {
                                                setCardToEdit({ ...card, columnIndex: colIndex });
                                                setShowCreateCardModal(true);
                                              }}
                                            >
                                              {card.title}
                                            </div>
                                          )}
                                        </Draggable>
                                      );
                                    })
                                  ) : (
                                    <span className={styles.placeholder}>Sem cartões</span>
                                  )}
                                  {provided.placeholder}
                                </div>

                                <button
                                  className={styles.addCardBtn}
                                  onClick={() => handleCreateCardClick(colIndex)}
                                >
                                  + Adicionar Cartão
                                </button>
                              </div>
                            )}
                          </Droppable>
                        );
                      })}

                      <button
                        className={styles.addColumnStyledBtn}
                        onClick={() => {
                          if (selectedBoardIndex !== null) {
                            setShowCreateColumnModal(true);
                          } else {
                            alert("Selecione ou crie um quadro primeiro.");
                          }
                        }}
                      >
                        <FaPlus size={10} style={{ marginRight: "6px" }} />
                        Adicionar nova lista
                      </button>
                    </>
                  ) : (
                    <div className={styles.emptyBoard}>
                      <p className={styles.emptyText}>
                        Este quadro está vazio. <em>Comece criando uma coluna.</em>
                      </p>
                      <button
                        className={styles.addColumnStyledBtn}
                        onClick={() => {
                          if (selectedBoardIndex !== null) {
                            setShowCreateColumnModal(true);
                          } else {
                            alert("Selecione ou crie um quadro primeiro.");
                          }
                        }}
                      >
                        <FaPlus size={10} style={{ marginRight: "6px" }} />
                        Adicionar nova lista
                      </button>
                    </div>
                  )}
                </div>
              </DragDropContext>

            </div>
          )}

          {/* Modal de criação de coluna */}
          {showCreateColumnModal && (
            <CreateColumnModal
              onClose={() => setShowCreateColumnModal(false)}
              onCreate={handleCreateColumn}
              loading={isCreatingColumn}
            />
          )}

        </main>

      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateBoard}
          loading={isCreatingBoard}
        />
      )}

      {showRenameModal && renameIndex !== null && (
        <RenameBoardModal
          boardName={boards[renameIndex].name}
          onClose={() => {
            setRenameIndex(null);
            setShowRenameModal(false);
          }}
          onConfirm={handleConfirmRename}
          loading={isRenamingBoard}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          boardName={boards[deleteIndex]?.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteBoard}
          loading={isDeletingBoard}
        />
      )}

      {showRenameColumnModal && selectedBoardIndex !== null && (
        <RenameColumnModal
          columnName={boards[selectedBoardIndex]?.columns[columnToRename]?.title || ''}
          onClose={() => setShowRenameColumnModal(false)}
          onConfirm={handleConfirmRenameColumn}
          loading={isRenamingColumn}
        />
      )}

      {showDeleteColumnModal && (
        <DeleteColumnConfirmModal
          columnName={boards[selectedBoardIndex].columns[columnToDeleteIndex].name}
          onCancel={() => setShowDeleteColumnModal(false)}
          onConfirm={handleConfirmDeleteColumn}
          loading={isDeletingColumn}
        />
      )}

      {showCreateCardModal && (
        <CreateCardModal
          onClose={() => {
            setShowCreateCardModal(false);
            setCardToEdit(null);
          }}
          onCreate={handleCreateCard}
          onDelete={handleDeleteCard}
          card={cardToEdit}
          isEditing={!!cardToEdit}
          loading={isSavingCard}
          isDeleting={isDeletingCard}
        />
      )}

      {showDeleteCardConfirmModal && (
        <DeleteCardConfirmModal
          cardTitle={cardToDelete?.title}
          onCancel={() => {
            setShowDeleteCardConfirmModal(false);
            setCardToDelete(null);
          }}
          onConfirm={confirmDeleteCard}
          loading={isDeletingCard}
        />
      )}

    </div>
  );
};

export default BoardWorkspace;