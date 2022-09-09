# eduExplore
A web app that is a crowd-sourced research website for comparing college programs.

# Technologies
This web application runs on a MEAN stack and was originally developed in 2017 using the package versions available at that time. See "Additional Notes"
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) collection to store data from CPFB public dataset.
* [Express](https://expressjs.com/) middleware to connect API routes to Node.js server.
* [AngularJS](https://angularjs.org/) for conroller to interact with API routes.
* [Node.js](https://nodejs.org/en/) for app server and queries to MongoDB.
* [Bootstrap](https://getbootstrap.com/) for UI theme & custom CSS.

# Data
The dataset of Universities is modified from [Database of Accredited Postsecondary Institutions and Programs](https://ope.ed.gov/dapip/#/home). Program data for each university is editable within the application and is crowd-sourced.

# How To
## Install
Clone the repo and at the root folder run
```
npm install
```

Install MongoDB for your development machine. I use Robomongo aka [Studio3T](https://robomongo.org/) for a GUI client.

## Import Dataset
* *Windows* - run [/data/Import_Collections.bat](/data/Import_Collections.bat) to import the collection into MongoDB
* *Mac/Linux* - run [/data/Import_Collections.sh](/data/Import_Collections.sh) to run the script that imports the collection into MongoDB

## Configure MongoDB
Using the [/config.js](/config.js) file, update to your `mongo_port` and `node_port` for the ports on which you wish to run MongoDB and Node.js respectively.

## Run App
Once collection has been imported to database and app configured, run `npm start` and you will see the console messages shown below
```
$ npm start

> edu-explore@1.0.0 start C:\Users\navin\Documents\Projects\Github\eduExplore
> node server.js

mongodb uri: mongodb://localhost:27017/?ssl=false
Express server listening on port 3000, DB is MongoD

```

In your browser, open http://localhost:3000/ to see the app

# Demo
## Live
This app has been hosted at https://edu-explore.nvarma.com/ with data from sourced in 2017.

## Preview
### Server side search, filterable dynamic table
![Screenshot from the app](/img/homepage.png)

### University search
![Screenshot from the app](/img/universities.png)

### Add Program to University
![Screenshot from the app](/img/addprogram.png)


# Additonal Notes
This web application runs on a MEAN stack and was originally developed in 2017 using the package versions available at that time. It originated from a personal need to help my family navigate college adminisions and cost of higher education for a graduate Data Science program. This was a project to learn developing in the MEAN stack when it was up and coming library, coding practices were mostly to follow clear separation of API routes, Node server logic and DB queries to present them in cool looking UI views. Most of the code is self-explanatory with little comments strewn around.