let notes = [
  {
    id: 1,
    author: "first author",
    title: "first note",
    content: "My first note is here.",
  },
];

export const listNotes = () => {
  return notes.map(({ id, author, title, content }) => ({
    id,
    author,
    title,
    content,
  }));
};

export const getNote = (id) => {
  const note = notes.find((n) => n.id === id);
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
};

export const createNote = (author, title, content) => {
  const lastId = notes.length ? notes[notes.length - 1].id : 0;

  const newNote = {
    id: lastId + 1,
    author,
    title,
    content,
  };

  notes.push(newNote);
  return newNote;
};

export const updateNote = (id, author, title, content) => {
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    throw new Error("Note not found for update");
  }

  notes[index] = {
    ...notes[index],
    author,
    title,
    content,
  };

  return notes[index];
};

export const deleteNote = (id) => {
  const exists = notes.some((n) => n.id === id);

  if (!exists) {
    throw new Error("Note not found for delete");
  }

  notes = notes.filter((n) => n.id !== id);
};
