const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(express.json());

// informations de connexion databases
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist',
    port: '3306'
})

// connexion
db.connect(err => {
    if (err) {
        console.log('Erreur de connexion à la base données' + err);
        return;
    }
    console.log('connecté à la base de données')
})

//selection toutes les taches  
app.get(`/tasks`, (req, res) => {
    db.query(`SELECT * FROM task`, (err, results) => {
      if(err){
          res.status(500).send(err);
      }else {
          res.json(results);
      }
    });
  }); 

//selection des taches en rapport à leur id  
app.get(`/tasks/:id`, (req, res) => {
    let id = req.params.id;
    db.query(`SELECT * FROM task WHERE idtask= ${id}`, (err, results) => {
      if(err){
          res.status(500).send(err);
      }else {
          res.json(results);
      }
    });
  }); 

//selection des taches en rapport à leur statusid
app.get('/tasks/status:id', (req, res) => {
    let id = req.params.id;
    db.query(`SELECT taskTitle, taskContent FROM task WHERE status_idstatus=${id}`, (err, results) => {
      if(err){
          res.status(500).send(err);
      }else {
          res.json(results);
      }
    });
  });

// Add a task
app.post('/tasks', (req, res) => {
  const { taskTitle, taskContent } = req.body;
  const status_idstatus = 2; // Default value set to 2
  const isFinished = 0;
  const query = 'INSERT INTO `task` (`taskTitle`, `taskContent`, `createdAt`, `isFinished`, `status_idstatus`) VALUES (?, ?, NOW(), ?, ?)';

  db.query(query, [taskTitle, taskContent, isFinished, status_idstatus], (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Error adding the task: ' + err.message });
      } else {
          res.status(201).json({ message: "Task successfully added", id: results.insertId });
      }
  });
});

//add status
app.post('/status', (req, res) => {
  const { labelStatus } = req.body;
  const query = 'INSERT INTO `status` (`labelStatus`) VALUES (?)';
  db.query(query, [labelStatus], (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Error adding the task: ' + err.message });
      } else {
          res.status(201).json({ message: "status successfully added", id: results.insertId });
      }
  });
});

//delete status
app.delete(`/status/:id`, (req, res) => {
  let id = req.params.id;
  db.query(`DELETE FROM status WHERE idstatus= ${id}`, (err, results) => {
    if(err){
        res.status(500).send(err);
    }else {
      res.status(201).json({ message: "status delete ok" });
    }
  });
});

//Update status
app.put('/tasks/:id', (req, res) => {
  const idtask = req.params.id;
  const { taskTitle, taskContent } = req.body;
  const status_idstatus = 2; // Valeur par défaut définie sur 2
  const isFinished = 0;
  const query = 'UPDATE `task` SET `taskTitle`=?, `taskContent`=?, `createdAt`=NOW(), `isFinished`=?, `status_idstatus`=? WHERE `idtask`=?';

  db.query(query, [taskTitle, taskContent, isFinished, status_idstatus, idtask], (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche : ' + err.message });
      } else {
          res.status(201).json({ message: "Tâche mise à jour avec succès" });
      }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

