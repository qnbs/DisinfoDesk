import { describe, it, expect } from 'vitest';
import simulationReducer, { setParams, resetParams } from '../../store/slices/simulationSlice';

const getInitialState = () => simulationReducer(undefined, { type: '@@INIT' });

describe('simulationSlice', () => {
  describe('initial state', () => {
    it('has default parameters', () => {
      const state = getInitialState();
      expect(state.params).toEqual({
        emotionalPayload: 50,
        novelty: 50,
        visualProof: 20,
        echoChamberDensity: 30,
      });
    });

    it('starts with rValue of 0.5', () => {
      const state = getInitialState();
      expect(state.rValue).toBe(0.5);
    });
  });

  describe('setParams', () => {
    it('updates all parameters', () => {
      const state = getInitialState();
      const newParams = {
        emotionalPayload: 80,
        novelty: 70,
        visualProof: 60,
        echoChamberDensity: 50,
      };
      const next = simulationReducer(state, setParams(newParams));
      expect(next.params).toEqual(newParams);
    });

    it('recalculates rValue using the formula', () => {
      const state = getInitialState();
      const params = {
        emotionalPayload: 100,
        novelty: 100,
        visualProof: 100,
        echoChamberDensity: 100,
      };
      const next = simulationReducer(state, setParams(params));
      // formula: 0.5 + (100*0.04) + (100*0.02) + (100*0.015) + (100*0.01) = 0.5 + 4 + 2 + 1.5 + 1 = 9
      expect(next.rValue).toBe(9);
    });

    it('computes low rValue for low params', () => {
      const state = getInitialState();
      const params = {
        emotionalPayload: 0,
        novelty: 0,
        visualProof: 0,
        echoChamberDensity: 0,
      };
      const next = simulationReducer(state, setParams(params));
      expect(next.rValue).toBe(0.5);
    });

    it('computes rValue for default params', () => {
      const state = getInitialState();
      // emotionalPayload=50, novelty=50, visualProof=20, echoChamberDensity=30
      // 0.5 + (50*0.04) + (50*0.02) + (20*0.015) + (30*0.01) = 0.5 + 2 + 1 + 0.3 + 0.3 = 4.1
      const next = simulationReducer(state, setParams(state.params));
      expect(next.rValue).toBe(4.1);
    });
  });

  describe('resetParams', () => {
    it('resets to initial state', () => {
      const initial = getInitialState();
      let state = simulationReducer(initial, setParams({
        emotionalPayload: 99,
        novelty: 99,
        visualProof: 99,
        echoChamberDensity: 99,
      }));
      state = simulationReducer(state, resetParams());
      expect(state.params).toEqual(initial.params);
      expect(state.rValue).toBe(initial.rValue);
    });
  });
});
