import React, { useState, useEffect } from 'react';
import { moviesTemplateService } from '../../../services/moviesTemplateService';
import styles from './styles/TemplateSelector.module.css';

const TemplateSelector = ({ onSelect, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await moviesTemplateService.getTemplates();
        setTemplates(data);
      } catch (error) {
        setError('Erro ao carregar templates');
        console.error('Erro ao carregar templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando templates...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Selecione o tipo de quadro</h2>
      <div className={styles.templateList}>
        {templates.map((template) => (
          <button
            key={template.id}
            className={styles.templateButton}
            onClick={() => onSelect(template.id)}
          >
            {template.name}
          </button>
        ))}
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default TemplateSelector; 