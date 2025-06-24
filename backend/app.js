require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { clerkMiddleware } = require('@clerk/express');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var forumRouter = require('./routes/forum');
var adminForumRouter = require('./routes/adminForum');
var flashcardSetsRouter = require('./routes/flashcardSets');
var clerkUserRouter = require('./routes/clerkUser');
var communityRouter = require('./routes/community');
const flashcardRoutes = require('./routes/flashcards');
var adminDashboard = require('./routes/adminDashboard'); 
const videosRouter = require('./routes/videos');

var app = express();

app.use(cors());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(clerkMiddleware());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/clerk-user', clerkUserRouter);
app.use('/api/forum', forumRouter);
app.use('/api/admin/forum', adminForumRouter);
app.use('/api/community', communityRouter);
app.use('/flashcard-sets', flashcardSetsRouter);
app.use('/flashcards', flashcardRoutes);
app.use('/api/admin', adminDashboard);
app.use('/api/videos', videosRouter);

module.exports = app;
