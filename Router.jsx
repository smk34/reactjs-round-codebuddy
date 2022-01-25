import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Fallback from './Fallback';

const Home = React.lazy(() => import('./pages/Home'));
const Posts = React.lazy(() => import('./pages/Posts'));
const BookSeat = React.lazy(() => import('./pages/BookSeat'));

const Router = () => (
  <React.Suspense fallback={<Fallback />}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/posts" component={Posts} />
        <Route exact path="/bookSeat" component={BookSeat} />
      </Switch>
    </BrowserRouter>
  </React.Suspense>
);

export default Router;
