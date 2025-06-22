require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { clerkMiddleware } = require('@clerk/express');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
<<<<<<< HEAD
var forumRouter = require('./routes/forum');
var adminForumRouter = require('./routes/adminForum');
=======
var flashcardSetsRouter = require('./routes/flashcardSets');
>>>>>>> refs/remotes/origin/main

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(clerkMiddleware());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/forum', forumRouter);
app.use('/api/admin/forum', adminForumRouter);
=======
app.use('/flashcard-sets', flashcardSetsRouter);
>>>>>>> refs/remotes/origin/main

module.exports = app;
