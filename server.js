/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const tickets = [
  {
    id: '1',
    name: 'Задача',
    description: 'полное описание задачи',
    status: 'false',
    created: '2017-02-03 12:13',
  },
  {
    id: '2',
    name: 'Задача 2',
    description: 'полное описание задачи 2',
    status: 'true',
    created: '2020-02-03 12:13',
  },
  {
    id: '3',
    name: 'Задача 3',
    description: 'полное описание задачи 3',
    status: 'false',
    created: '2021-23-03 12:13',
  },
];

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const uuid = require('uuid');
const moment = require('moment');

moment.locale('ru');

const app = new Koa();

// test push ticket
tickets.push({
  id: uuid.v4(),
  name: 'Задача 5',
  description: 'полное описание задачи 5',
  status: 'false',
  created: `${moment().format('L')} ${moment().format('LT')}`,
});
tickets.push({
  id: uuid.v4(),
  name: 'Задача 6',
  description: 'полное описание задачи 6',
  status: 'false',
  created: `${moment().format('L')} ${moment().format('LT')}`,
});
tickets.push({
  id: uuid.v4(),
  name: 'Задача 32',
  description: 'полное описание задачи 32',
  status: 'false',
  created: `${moment().format('L')} ${moment().format('LT')}`,
});

// koaBody
app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
    text: true,
  })
);

// CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) return await next();

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (error) {
      error.headers = { ...error.headers, ...headers };
      throw error;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Request-Method': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set(
        'Access-Control-Request-Headers',
        ctx.request.get('Access-Control-Request-Headers')
      );
    }

    ctx.response.status = 204; // No content
  }
});

// response

app.use(async (ctx) => {
  const { method, id: reqId } = ctx.request.query;
  // const reqId = ctx.request.query.id;
  const { name: reqName, description: reqDescription } = ctx.request.body;
  // const reqName = ctx.request.body.name;
  // const reqDescription = ctx.request.body.description;
  const ind = tickets.findIndex(({ id }) => id === reqId);

  switch (method) {
    case 'allTickets':
      ctx.response.body = JSON.stringify(
        tickets.map(({ id, name, status, created }) => ({
          id,
          name,
          status,
          created,
        }))
      );
      return;

    case 'ticketById':
      if (reqId) {
        ctx.response.body = JSON.stringify(
          tickets.find(({ id }) => id === reqId)
        );
      } else {
        ctx.response.status = 404;
      }
      return;

    case 'createTicket':
      // eslint-disable-next-line no-case-declarations
      const newTicket = {
        id: uuid.v4(),
        name: reqName,
        description: reqDescription,
        status: 'false',
        created: `${moment().format('L')} ${moment().format('LT')}`,
      };
      tickets.push(newTicket);

      ctx.response.body = JSON.stringify(newTicket);
      return;

    case 'editTicket':
      tickets[ind].name = reqName;
      tickets[ind].description = reqDescription;
      ctx.response.body = true;

      return;

    case 'deleteTicket':
      tickets[ind].splice(ind, 1);
      ctx.response.body = true;
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

// Server
const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);
