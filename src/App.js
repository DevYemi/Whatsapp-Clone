import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login';
import Room from './components/Room';
import Sidebar from './components/Sidebar';
import { useStateValue } from './components/StateProvider';
import UserProfile from './components/UserProfile';
function App() {
  const [{ user }] = useStateValue();
  console.log(user)
  return (
    <div className="app">
      {!user ?
        <Login />
        :
        <Router>
          <div className="app__body">
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Room />
              </Route>
              <Route path="/chats/:chatId">
                <Chat />
              </Route>
            </Switch>
            <UserProfile />
          </div>
        </Router>
      }
    </div>
  );
}

export default App;
