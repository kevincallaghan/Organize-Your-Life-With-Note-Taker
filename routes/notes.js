const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET all of my notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST a new note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

// DELETE a note
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  const id = req.params.id;

  readFromFile('./db/db.json').then((data) => {
    console.log('Deleting ID: ' + id);
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter(note => note.id !== id);
    writeToFile('./db/db.json', updatedNotes);
    res.json(`Note with id ${id} deleted successfully`);
    console.log(`Note with id ${id} deleted successfully`);
  });
});

module.exports = notes;