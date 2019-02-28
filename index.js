//set up
let databasePosts = null;
let express = require('express')
let app = express();
let bodyParser = require('body-parser')

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
let posts = [];

//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new



function saveNewPost(request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  let post= {};

  post.message = request.body.message;
  post.image = request.body.image;
  post.time = new Date();
  posts.push(post); //save it in our list

  response.send("thanks for your message. Press back to add another");
  databasePosts.insert(post);
}
app.post('/posts', saveNewPost);
let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://girlcode2019:hats123@ds135305.mlab.com:35305/girlcode2019level2';
let databaseName = 'girlcode2019level2';

MongoClient.connect(databaseUrl, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function(err, results) {
    if (err) throw err;
    console.log("Found " + results.length + " results");
    posts = results
  });
});
//listen for connections on port 3000
app.listen (process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");

//makes server listen to login post
function login(request, response) {
  console.log("someone tried to log in");
  response.send("OK");
}
app.post("/login", login);

//makes server listen to signup post
function signup(request, response) {
  console.log("someone tried to sign up");
  response.send("OK");
}
app.post("/signup", signup);