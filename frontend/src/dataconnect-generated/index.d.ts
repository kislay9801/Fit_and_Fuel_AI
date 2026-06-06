import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Attempt_Key {
  id: UUIDString;
  __typename?: 'Attempt_Key';
}

export interface CreateSessionData {
  session_insert: Session_Key;
}

export interface CreateSessionVariables {
  exerciseId: UUIDString;
  duration: number;
}

export interface Exercise_Key {
  id: UUIDString;
  __typename?: 'Exercise_Key';
}

export interface FeedbackItem_Key {
  id: UUIDString;
  __typename?: 'FeedbackItem_Key';
}

export interface GetUserSessionsData {
  sessions: ({
    timestamp: TimestampString;
    duration?: number | null;
    totalScore?: number | null;
    exercise: {
      name: string;
    };
  })[];
}

export interface ListExercisesData {
  exercises: ({
    name: string;
    muscleGroup: string;
    difficultyLevel?: string | null;
  })[];
}

export interface RecordAttemptData {
  attempt_insert: Attempt_Key;
}

export interface RecordAttemptVariables {
  sessionId: UUIDString;
  formScore: number;
  comments: string;
}

export interface Session_Key {
  id: UUIDString;
  __typename?: 'Session_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListExercisesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListExercisesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListExercisesData, undefined>;
  operationName: string;
}
export const listExercisesRef: ListExercisesRef;

export function listExercises(options?: ExecuteQueryOptions): QueryPromise<ListExercisesData, undefined>;
export function listExercises(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListExercisesData, undefined>;

interface CreateSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSessionVariables): MutationRef<CreateSessionData, CreateSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSessionVariables): MutationRef<CreateSessionData, CreateSessionVariables>;
  operationName: string;
}
export const createSessionRef: CreateSessionRef;

export function createSession(vars: CreateSessionVariables): MutationPromise<CreateSessionData, CreateSessionVariables>;
export function createSession(dc: DataConnect, vars: CreateSessionVariables): MutationPromise<CreateSessionData, CreateSessionVariables>;

interface RecordAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordAttemptVariables): MutationRef<RecordAttemptData, RecordAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordAttemptVariables): MutationRef<RecordAttemptData, RecordAttemptVariables>;
  operationName: string;
}
export const recordAttemptRef: RecordAttemptRef;

export function recordAttempt(vars: RecordAttemptVariables): MutationPromise<RecordAttemptData, RecordAttemptVariables>;
export function recordAttempt(dc: DataConnect, vars: RecordAttemptVariables): MutationPromise<RecordAttemptData, RecordAttemptVariables>;

interface GetUserSessionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserSessionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserSessionsData, undefined>;
  operationName: string;
}
export const getUserSessionsRef: GetUserSessionsRef;

export function getUserSessions(options?: ExecuteQueryOptions): QueryPromise<GetUserSessionsData, undefined>;
export function getUserSessions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserSessionsData, undefined>;

