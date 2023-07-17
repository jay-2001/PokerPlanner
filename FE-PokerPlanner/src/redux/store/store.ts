import { AnyAction, applyMiddleware, createStore } from '@reduxjs/toolkit';
import thunk, { ThunkDispatch } from 'redux-thunk';

import reducers from '@Redux/reducers/index';

export const store = createStore(reducers, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
