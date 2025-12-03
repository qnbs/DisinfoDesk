
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SatireResponse, SatireOptions, Language, SatireParams } from '../../types';
import { generateSatireTheory } from '../../services/geminiService';
import { dbService } from '../../services/dbService';

interface SatireState {
  data: SatireResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SatireState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async Thunk handles API call and DB persistence
export const generateAndSaveSatire = createAsyncThunk(
  'satire/generate',
  async ({ language, options }: { language: Language; options: SatireOptions }, { rejectWithValue }) => {
    try {
      const data = await generateSatireTheory(language, options);
      
      // Auto-persist successfully generated satire (optional, can be separated)
      // Here we just return data, component decides to save or we can do it here.
      // Let's do a temporary save or just return data for state. 
      // The original code had a manual "Save" button. Let's keep it purely state-based for now.
      
      return data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveSatireToVault = createAsyncThunk(
    'satire/save',
    async ({ satire, params }: { satire: SatireResponse, params: SatireParams }, { rejectWithValue }) => {
        try {
            await dbService.saveSatire({
                id: 'satire_' + Date.now(),
                title: satire.title,
                content: satire.content,
                timestamp: Date.now(),
                params
            });
            return true;
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const satireSlice = createSlice({
  name: 'satire',
  initialState,
  reducers: {
    resetSatire: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAndSaveSatire.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateAndSaveSatire.fulfilled, (state, action: PayloadAction<SatireResponse>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(generateAndSaveSatire.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetSatire } = satireSlice.actions;
export default satireSlice.reducer;