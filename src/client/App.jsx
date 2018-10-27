import React, { Fragment } from 'react';
import {
  Route, Switch, Link, BrowserRouter as Router,
} from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';
import logo from '../images/votify-emblem.png';
import Tracks from './Tracks';
import Stats from './Stats';
import Top from './Top';

require('./app.css');

const App = () => (
  <CookiesProvider>
    <React.Fragment>
      <Router>
        <Switch>
          <Fragment>
            <header>
              <img alt="Votify" src={logo} />
              <div>
                <h1>
                  <Link to="/">Votify</Link>
                </h1>
                <p>
                  Vote on songs to be added to the playlist.
                  <br />
                  All songs that the majority has voted up will be added.
                </p>
              </div>
              <div>
                <Link to="/stats">Stats</Link>
                {' - '}
                <Link to="/top">Top</Link>
              </div>
            </header>
            <main>
              <Route exact path="/" component={Tracks} />
              <Route path="/stats" component={Stats} />
              <Route path="/top" component={Top} />
            </main>
          </Fragment>
        </Switch>
      </Router>
    </React.Fragment>
  </CookiesProvider>
);

export default withCookies(App);
