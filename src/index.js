import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { registerServiceWorker, cleanupExpiredCache } from './utils/pwaUtils';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
   </React.StrictMode>
);

// Register Service Worker and initialize PWA features
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker()
    .then((registration) => {
      if (registration) {
        console.log('PWA: Service Worker registered successfully');
      }
    })
    .catch((error) => {
      console.error('PWA: Service Worker registration failed', error);
    });
}

// Clean up expired cache
cleanupExpiredCache();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
