import React, { useState, useEffect } from "react";
import { Switch, Route} from "react-router-dom";
import { useDispatch } from "react-redux";
import Navigation from "./components/Navigation";
import HomePage from "./components/Home";
import SpotDetail from "./components/SingleSpotDetail"
import * as sessionActions from "./store/session";
import EditSpotForm from "./components/CreateSpotForm/EditForm";
import CreateSpotForm from "./components/CreateSpotForm/CreateForm";



function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);


  return (
    <>
    <Navigation isLoaded={isLoaded} />
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/spots/new">
        <CreateSpotForm />
      </Route>
      <Route path="/spots/:spotId">
        <SpotDetail />
      </Route>
      <Route path="/spots/:spotId/edit">
        <EditSpotForm />
      </Route>
    </Switch>
    {isLoaded && <Switch></Switch>}
    </>
  );
}

export default App;
