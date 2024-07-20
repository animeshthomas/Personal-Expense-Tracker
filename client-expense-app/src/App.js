import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/about" component={AboutPage} />
        {/* Add other routes here */}
        <Route component={NotFoundPage} /> {/* Catch-all route for 404 */}
      </Switch>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/about" component={AboutPage} />
        {/* Add other routes here */}
        <Route component={NotFoundPage} /> {/* Catch-all route for 404 */}
      </Switch>
    </Router>
  );
}

export default App;
