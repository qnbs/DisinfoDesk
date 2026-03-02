import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Author } from '../../types';
import { AUTHORS_FULL } from '../../data/enriched';

const authorsAdapter = createEntityAdapter<Author>({
  sortComparer: (a, b) => b.influenceLevel - a.influenceLevel,
});

interface AuthorsState {
  entities: ReturnType<typeof authorsAdapter.getInitialState>;
}

const initialState: AuthorsState = {
  entities: authorsAdapter.setAll(authorsAdapter.getInitialState(), AUTHORS_FULL),
};

export const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {},
});

interface RootStateSubset {
  authors: AuthorsState;
}

const adapterSelectors = authorsAdapter.getSelectors<RootStateSubset>(
  (state) => state.authors.entities
);

export const selectAllAuthors = (state: RootStateSubset) => adapterSelectors.selectAll(state);

export const selectAuthorById = (state: RootStateSubset, authorId: string) =>
  adapterSelectors.selectById(state, authorId);

export default authorsSlice.reducer;
