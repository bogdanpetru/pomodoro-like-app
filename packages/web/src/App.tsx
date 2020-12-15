import React, { useState, useEffect, createContext } from "react";
import styled, { createGlobalStyle} from "styled-components";

// theming
import { ThemeProvider } from "styled-components";
import { primary } from "@app/theme";

// routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// views
import Projects from "./views/Projects";
import ProtectedRoute from './components/ProtectedRoute';
import Auth from "./views/Auth";

import { useAuth } from '@app/data/auth';
import { Loader } from "@app/components";

const authServiceConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATA_BASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const GlobalStyle = createGlobalStyle`
  html {
    ${primary.common}
  }
`;

function App() {
  const { loading } = useAuth(authServiceConfig);
  
  if (loading) {
    return <Loader />;
  }

  return (
      <ThemeProvider theme={primary}>
        <GlobalStyle />
        <Container>
          <Router>
            <Switch>
              <Route path="/login">
                <Auth />
              </Route>
              <ProtectedRoute path="/">
                <Projects />
              </ProtectedRoute>
            </Switch>
          </Router>
        </Container>
      </ThemeProvider>
  );
}

export default App;
