import 'babel-polyfill'
import 'isomorphic-fetch'

import soular from 'soular'
import serveStatic from 'soular/static'
import ping from 'soular/ping'
import cors from 'soular/cors'
import router from 'soular/react-router'

import functions from './functions'

import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'

import { createMemoryHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import routes from './routes'
import Container, { configureStore } from './Container'

const DEBUG = process.env.NODE_ENV !== 'production'
const APP_PORT = DEBUG ? 3001 : process.env.PORT || 8080

// This is a hack, should be replaced with a real stylesheet
const GLOBAL_STYLES = `
  html {
    height: 100%;
    overflow: hidden;
  }

  body {
    height: 100%;
    overflow: auto;
  }
`

soular('*')
.use(cors)
.use(ping)
.use(serveStatic('', DEBUG ? 'resources/static' : 'static'))
.use((ctx) => {
  const store = configureStore()
  const initialState = JSON.stringify(store.getState())
  const memoryHistory = createMemoryHistory(ctx.req.url)
  const history = syncHistoryWithStore(memoryHistory, store)

  const appScript = process.env.NODE_ENV === 'production'
    ? require('./stats').main
    : 'app.js'

  return router({ history, routes }, (content) => {
    const app = renderToString(
      <Container store={store}>
        {content}
      </Container>
    )

    return '<!doctype html>' + renderToStaticMarkup(
      <html lang='en'>
        <head>
          <title>SuperFeed</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css' />
          <link rel='stylesheet' href='https://oss.maxcdn.com/semantic-ui/2.1.8/semantic.min.css' />
          <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
          <script dangerouslySetInnerHTML={{ __html: 'window.__REDUX_INIT = ' + initialState }}></script>
          <script src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js'></script>
        </head>
        <body>
          <div id='root' dangerouslySetInnerHTML={{ __html: app }}></div>
          <script src={appScript}></script>
        </body>
      </html>
    )
  })(ctx)
})

.use(functions)

.listen(APP_PORT)

.on('listening', () => console.log(`Server listening at ${APP_PORT}`))
