import { ListExercisesData, CreateSessionData, CreateSessionVariables, RecordAttemptData, RecordAttemptVariables, GetUserSessionsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListExercises(options?: useDataConnectQueryOptions<ListExercisesData>): UseDataConnectQueryResult<ListExercisesData, undefined>;
export function useListExercises(dc: DataConnect, options?: useDataConnectQueryOptions<ListExercisesData>): UseDataConnectQueryResult<ListExercisesData, undefined>;

export function useCreateSession(options?: useDataConnectMutationOptions<CreateSessionData, FirebaseError, CreateSessionVariables>): UseDataConnectMutationResult<CreateSessionData, CreateSessionVariables>;
export function useCreateSession(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSessionData, FirebaseError, CreateSessionVariables>): UseDataConnectMutationResult<CreateSessionData, CreateSessionVariables>;

export function useRecordAttempt(options?: useDataConnectMutationOptions<RecordAttemptData, FirebaseError, RecordAttemptVariables>): UseDataConnectMutationResult<RecordAttemptData, RecordAttemptVariables>;
export function useRecordAttempt(dc: DataConnect, options?: useDataConnectMutationOptions<RecordAttemptData, FirebaseError, RecordAttemptVariables>): UseDataConnectMutationResult<RecordAttemptData, RecordAttemptVariables>;

export function useGetUserSessions(options?: useDataConnectQueryOptions<GetUserSessionsData>): UseDataConnectQueryResult<GetUserSessionsData, undefined>;
export function useGetUserSessions(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserSessionsData>): UseDataConnectQueryResult<GetUserSessionsData, undefined>;
