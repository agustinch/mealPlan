import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app';
import AppMenu from '../shared/components/AppMenu';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ToastNotification from '../shared/utils/toast';
import { SnackbarProvider } from 'notistack';
import { SnackbarConfigurator } from '../shared/utils/toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        {/* <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <>
            <SnackbarConfigurator />
            <AppMenu mainPage={<Component {...pageProps} />}></AppMenu>
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </SnackbarProvider>*/}
        <Component {...pageProps} />
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
