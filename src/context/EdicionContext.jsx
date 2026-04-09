import React, { createContext, useState, useContext } from 'react';

const EdicionContext = createContext();

export const useEdicion = () => useContext(EdicionContext);

export const EdicionProvider = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EdicionContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EdicionContext.Provider>
  );
};
