// src/providers/AppProviders.js
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { TransactionsProvider } from '../context/TransactionsContext';

const AppProviders = ({ children }) => (
  <AuthProvider>
    <TransactionsProvider>
      {children}
    </TransactionsProvider>
  </AuthProvider>
);

export default AppProviders;
