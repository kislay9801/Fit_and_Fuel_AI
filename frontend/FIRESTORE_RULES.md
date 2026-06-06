// firestore.rules
// Copy these rules into your Firebase Console → Firestore → Rules tab.
// These rules ensure users can only read and write their own data.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Sessions: users can only read/write sessions they own
    match /sessions/{sessionId} {
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null
                                  && resource.data.userId == request.auth.uid;
    }
  }
}
