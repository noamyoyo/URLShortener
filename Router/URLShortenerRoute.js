const express = require("express");
const URLRoute = express.Router();
const URLModel = require("../Model/URLModel");



///uri = http://localhost:3000

/// create short URL

let generateShortURL = () => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// validate url func

let validateURL = (url) => {
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (pattern.test(url)) {
    return true;
  }
  return false;
};

/// add short URL and long URL to Object
/// return short URL
URLRoute.route("/add-new-url").post(async (req, res) => {
  let attempts = 0;
  console.log("check");
  while (attempts < 4){
  await URLModel.findOne({shortURL: generateShortURL()}, null, (err, result) => {
    if (err) {
      console.log(err);
    }
    else{
      let url = req.body.url;
      let urlhost = req.hostname;
      console.log(urlhost);
      console.log(url);
      if(validateURL(url)){
        if (result === null){
          attempts = 4;
          console.log("great, continue with code!");
          let DBObj = {shortURL: generateShortURL(), longURL: url}
          let obj = new URLModel(DBObj);
          obj.save().then((URLS) => {
                  let fullUrl =
                    "Shortened Url: " + "http://" + urlhost + ":3000/" + URLS.shortURL;
                  res.status(200).send("Link added successfully! " + fullUrl);
                })
                .catch(() => {
                  res.status(400).send("Unable to add link");
                });
          
          
        }
        else{
          generateShortURL();
          console.log(shorturlgenerate);
          attempts++;
        }
      }
      
    }
    
  });
  
}
});

// get the short URL and redirect to the long URL

URLRoute.route("/:id").get((req, res) => {
  let id = req.params.id;
  console.log(id);

  URLModel.findOne({ shortURL: { $eq: id } }, (err, url) => {
    if (err) console.log(err);
    else {
      if (url === null) {
        res.status(200).send("Wrong URL, try again");
      } else if (url.shortURL === id) {
        console.log(url);
        res.redirect(301, url.longURL);
      }
    }
  });
});

module.exports = URLRoute;
