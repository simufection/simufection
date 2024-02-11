import { PlayingState } from "../_states/state";

export const stateNotPlaying = [PlayingState.waiting, PlayingState.finishing];
export const stateIsPlaying = [PlayingState.playing, PlayingState.pausing];
