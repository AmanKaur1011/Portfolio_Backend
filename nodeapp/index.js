const express = require("express");
const path = require("path");
const cors = require("cors"); //need this to set this API to allow requests from other servers
const dotenv = require("dotenv");
//load environment variables from the .env file
dotenv.config();
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || "3000";

// const dbUrl = "mongodb://localhost:27017/portfolio";
const dbUrl= `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/?retryWrites=true&w=majority&appName=Http5222`
const client = new MongoClient(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(cors({
  origin: "*"
}));
app.get("/api/projects", async (request, response) => {
    let projects = await getProjects();
    response.json(projects); //send JSON object with appropriate JSON headers
  });
  app.get("/api/skills", async (request, response) => {
    let skills = await getSkills();
    response.json(skills); //send JSON object with appropriate JSON headers
  });
  //page route  to  rpeoject Details
app.get("/api/projectDetail", async (request, response) => {
    let id = request.query.Id;
    let project = await getProject(id);
    response.json(project);
    //response.render("detail", { title: "Employee", employee: emp });

});
// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));
  // set up a folder for static files
//app.use(express.static(path.join(__dirname, "public")));
//set up server listening
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
  
  
  //MongoDB functions
  async function connection() {
    await client.connect();
    db = client.db("portfolio"); //select testdb database
    return db;
  }
  async function getProjects() {
    db = await connection(); //await result of connection() and store the returned db
    var results = db.collection("projects").find({}); //{} as the query means no filter, so select all
    res = await results.toArray();
    return res;
  }
  async function getSkills() {
    db = await connection(); //await result of connection() and store the returned db
    var results = db.collection("skills").find({}); //{} as the query means no filter, so select all
    res = await results.toArray();
    return res;
  }
  //function to get one project from the projects collection
async function getProject(id) {
  db = await connection();
  const proId = { _id: new ObjectId(id) };
  let result = db.collection("projects").findOne(proId);
  return await result;
}