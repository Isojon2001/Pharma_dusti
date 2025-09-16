import React, { useState } from 'react';

function FileInputFixedStatus({ id, label }) {
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : '');
  };

  return (
    <div className="file-input-wrapper">
      <label htmlFor={id} className="file-label">
        <input id={id} type="file" onChange={handleChange} />
        {label}
      </label>

      {!fileName && <span className="file-status">Файл не выбран</span>}
      {fileName && (
        <span className="file-name" title={fileName}>Выбран: {fileName}</span>
      )}
    </div>
  );
}

export default FileInputFixedStatus;
