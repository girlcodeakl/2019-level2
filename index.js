//set up
let databasePosts = null;
let express = require('express')
let app = express();
let bodyParser = require('body-parser')
let formidable = require('formidable');
let Binary = require('mongodb').Binary;
let fs = require('fs');

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

//Home page random image
function sendRandomPostsList(request, response) {
  let randomPost = posts[Math.floor(Math.random() * posts.length)];
  response.send(randomPost);
}
app.get('/homepagepost', sendRandomPostsList);

//let a client POST something new
function saveNewPost(request, response) {

  let form = new formidable.IncomingForm();//did i paste this in the right place?
  form.parse(request, function(err, fields, files) {
     //write it on the command prompt so we can see
    console.log(fields.artname);
    console.log(fields.description);
    console.log(fields.price);
    console.log(fields.hashtags);
if ( files.image == null ) {
  console.log ( "object is null")
  response.send("Hey you can't post unless you have an image");
  return
}

    let post= {};
    post.image = Binary(fs.readFileSync(files.image.path));
    post.imageType = files.image.type;
    post.artname = fields.artname;
    post.description = fields.description;
    post.price = fields.price;
    post.hashtags = fields.hashtags;//
    posts.push(post); //save it in our list
    response.send("thanks for your message. Press back to add another");
    databasePosts.insert(post);
  });

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
