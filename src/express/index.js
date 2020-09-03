"use strict";

const express = require(`express`);
const mainRouter = require(`./routes/main-routes`);
const registerRouter = require(`./routes/register-routes`);
const loginRouter = require(`./routes/login-routes`);
const myRouter = require(`./routes/my-routes`);
const offersRouter = require(`./routes/offers-routes`);
const searchRouter = require(`./routes/search-routes`);
const {DEFAULT_RENDER_PORT, NOT_FOUND_MESSAGE, SERVER_ERROR_MESSAGE, HttpCode} = require(`../constants`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/register`, registerRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use(`/search`, searchRouter);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_MESSAGE));

app.use((err, req, res) => res.status(HttpCode.INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE));

app.listen(DEFAULT_RENDER_PORT);
