
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationParams } from '../../types';

// State now only holds the PRESENT. History is managed by redux-undo wrapper in store.ts
interface SimulationState {
  params: SimulationParams;
  rValue: number;
}

const initialState: SimulationState = {
  params: {
    emotionalPayload: 50,
    novelty: 50,
    visualProof: 20,
    echoChamberDensity: 30
  },
  rValue: 0.5
};

const calculateR = (params: SimulationParams) => {
  return parseFloat((0.5 + 
    (params.emotionalPayload * 0.04) + 
    (params.novelty * 0.02) + 
    (params.visualProof * 0.015) + 
    (params.echoChamberDensity * 0.01)).toFixed(2));
};

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<SimulationParams>) => {
      // Logic for updating the "Present"
      state.params = action.payload;
      state.rValue = calculateR(action.payload);
    },
    resetParams: (_state) => {
      // Reset logic
      return initialState;
    }
  }
});

export const { setParams, resetParams } = simulationSlice.actions;
export default simulationSlice.reducer;
