const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next){ //MIDDLEWARE
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  
  console.time(logLabel);
  next();
 console.timeEnd(logLabel);
}

app.use(logRequests);

app.get('/repositories', (request, response) => {
 
  return response.json(repositories);

});


app.post('/repositories', (request, response) => { 
  const {title, url, techs} = request.body;
  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);
  
  return response.json(repo);   
});


app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
      return response.status(400).json({error: 'Project not found'});        
  }

  const {likes} = repositories[repoIndex];
  const newRepo = {
      id,
      title,
      url, 
      techs,
      likes,
  }

  repositories[repoIndex] = newRepo;

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
      return response.status(400).json({error: 'Project not found'});        
  }
  repositories.splice(repoIndex, 1) 

  return response.status(204).send(); //quando é uma resposta vazia -> 204

});

app.post("/repositories/:id/like", (request, response) => {
  //const {title, url, techs} = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
      return response.status(400).json({error: 'Project not found'});        
  }

  const { title, url, techs, likes} = repositories[repoIndex];
  
  let newLikes = likes +1;//repositories[repoIndex].likes +=1;
  const newRepo = {
      id,
      title,
      url, 
      techs,
      likes: newLikes,
  }

  repositories[repoIndex] = newRepo;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
