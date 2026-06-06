# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListExercises*](#listexercises)
  - [*GetUserSessions*](#getusersessions)
- [**Mutations**](#mutations)
  - [*CreateSession*](#createsession)
  - [*RecordAttempt*](#recordattempt)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListExercises
You can execute the `ListExercises` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listExercises(options?: ExecuteQueryOptions): QueryPromise<ListExercisesData, undefined>;

interface ListExercisesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListExercisesData, undefined>;
}
export const listExercisesRef: ListExercisesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listExercises(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListExercisesData, undefined>;

interface ListExercisesRef {
  ...
  (dc: DataConnect): QueryRef<ListExercisesData, undefined>;
}
export const listExercisesRef: ListExercisesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listExercisesRef:
```typescript
const name = listExercisesRef.operationName;
console.log(name);
```

### Variables
The `ListExercises` query has no variables.
### Return Type
Recall that executing the `ListExercises` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListExercisesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListExercisesData {
  exercises: ({
    name: string;
    muscleGroup: string;
    difficultyLevel?: string | null;
  })[];
}
```
### Using `ListExercises`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listExercises } from '@dataconnect/generated';


// Call the `listExercises()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listExercises();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listExercises(dataConnect);

console.log(data.exercises);

// Or, you can use the `Promise` API.
listExercises().then((response) => {
  const data = response.data;
  console.log(data.exercises);
});
```

### Using `ListExercises`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listExercisesRef } from '@dataconnect/generated';


// Call the `listExercisesRef()` function to get a reference to the query.
const ref = listExercisesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listExercisesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.exercises);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.exercises);
});
```

## GetUserSessions
You can execute the `GetUserSessions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserSessions(options?: ExecuteQueryOptions): QueryPromise<GetUserSessionsData, undefined>;

interface GetUserSessionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserSessionsData, undefined>;
}
export const getUserSessionsRef: GetUserSessionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserSessions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserSessionsData, undefined>;

interface GetUserSessionsRef {
  ...
  (dc: DataConnect): QueryRef<GetUserSessionsData, undefined>;
}
export const getUserSessionsRef: GetUserSessionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserSessionsRef:
```typescript
const name = getUserSessionsRef.operationName;
console.log(name);
```

### Variables
The `GetUserSessions` query has no variables.
### Return Type
Recall that executing the `GetUserSessions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserSessionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserSessions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserSessions } from '@dataconnect/generated';


// Call the `getUserSessions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserSessions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserSessions(dataConnect);

console.log(data.sessions);

// Or, you can use the `Promise` API.
getUserSessions().then((response) => {
  const data = response.data;
  console.log(data.sessions);
});
```

### Using `GetUserSessions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserSessionsRef } from '@dataconnect/generated';


// Call the `getUserSessionsRef()` function to get a reference to the query.
const ref = getUserSessionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserSessionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sessions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sessions);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateSession
You can execute the `CreateSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSession(vars: CreateSessionVariables): MutationPromise<CreateSessionData, CreateSessionVariables>;

interface CreateSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSessionVariables): MutationRef<CreateSessionData, CreateSessionVariables>;
}
export const createSessionRef: CreateSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSession(dc: DataConnect, vars: CreateSessionVariables): MutationPromise<CreateSessionData, CreateSessionVariables>;

interface CreateSessionRef {
  ...
  (dc: DataConnect, vars: CreateSessionVariables): MutationRef<CreateSessionData, CreateSessionVariables>;
}
export const createSessionRef: CreateSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSessionRef:
```typescript
const name = createSessionRef.operationName;
console.log(name);
```

### Variables
The `CreateSession` mutation requires an argument of type `CreateSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSessionVariables {
  exerciseId: UUIDString;
  duration: number;
}
```
### Return Type
Recall that executing the `CreateSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSessionData {
  session_insert: Session_Key;
}
```
### Using `CreateSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSession, CreateSessionVariables } from '@dataconnect/generated';

// The `CreateSession` mutation requires an argument of type `CreateSessionVariables`:
const createSessionVars: CreateSessionVariables = {
  exerciseId: ..., 
  duration: ..., 
};

// Call the `createSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSession(createSessionVars);
// Variables can be defined inline as well.
const { data } = await createSession({ exerciseId: ..., duration: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSession(dataConnect, createSessionVars);

console.log(data.session_insert);

// Or, you can use the `Promise` API.
createSession(createSessionVars).then((response) => {
  const data = response.data;
  console.log(data.session_insert);
});
```

### Using `CreateSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSessionRef, CreateSessionVariables } from '@dataconnect/generated';

// The `CreateSession` mutation requires an argument of type `CreateSessionVariables`:
const createSessionVars: CreateSessionVariables = {
  exerciseId: ..., 
  duration: ..., 
};

// Call the `createSessionRef()` function to get a reference to the mutation.
const ref = createSessionRef(createSessionVars);
// Variables can be defined inline as well.
const ref = createSessionRef({ exerciseId: ..., duration: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSessionRef(dataConnect, createSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.session_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.session_insert);
});
```

## RecordAttempt
You can execute the `RecordAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
recordAttempt(vars: RecordAttemptVariables): MutationPromise<RecordAttemptData, RecordAttemptVariables>;

interface RecordAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordAttemptVariables): MutationRef<RecordAttemptData, RecordAttemptVariables>;
}
export const recordAttemptRef: RecordAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordAttempt(dc: DataConnect, vars: RecordAttemptVariables): MutationPromise<RecordAttemptData, RecordAttemptVariables>;

interface RecordAttemptRef {
  ...
  (dc: DataConnect, vars: RecordAttemptVariables): MutationRef<RecordAttemptData, RecordAttemptVariables>;
}
export const recordAttemptRef: RecordAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordAttemptRef:
```typescript
const name = recordAttemptRef.operationName;
console.log(name);
```

### Variables
The `RecordAttempt` mutation requires an argument of type `RecordAttemptVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordAttemptVariables {
  sessionId: UUIDString;
  formScore: number;
  comments: string;
}
```
### Return Type
Recall that executing the `RecordAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordAttemptData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordAttemptData {
  attempt_insert: Attempt_Key;
}
```
### Using `RecordAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordAttempt, RecordAttemptVariables } from '@dataconnect/generated';

// The `RecordAttempt` mutation requires an argument of type `RecordAttemptVariables`:
const recordAttemptVars: RecordAttemptVariables = {
  sessionId: ..., 
  formScore: ..., 
  comments: ..., 
};

// Call the `recordAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordAttempt(recordAttemptVars);
// Variables can be defined inline as well.
const { data } = await recordAttempt({ sessionId: ..., formScore: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordAttempt(dataConnect, recordAttemptVars);

console.log(data.attempt_insert);

// Or, you can use the `Promise` API.
recordAttempt(recordAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.attempt_insert);
});
```

### Using `RecordAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordAttemptRef, RecordAttemptVariables } from '@dataconnect/generated';

// The `RecordAttempt` mutation requires an argument of type `RecordAttemptVariables`:
const recordAttemptVars: RecordAttemptVariables = {
  sessionId: ..., 
  formScore: ..., 
  comments: ..., 
};

// Call the `recordAttemptRef()` function to get a reference to the mutation.
const ref = recordAttemptRef(recordAttemptVars);
// Variables can be defined inline as well.
const ref = recordAttemptRef({ sessionId: ..., formScore: ..., comments: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordAttemptRef(dataConnect, recordAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attempt_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attempt_insert);
});
```

