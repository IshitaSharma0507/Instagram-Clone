import firebase from "firebase";
const firebaseApp =firebase.initializeApp({
        apiKey: "AIzaSyCbpHIj3BSPd1McvBaTA53JeYUEvaXtbOY",
        authDomain: "instagram-clone-3e592.firebaseapp.com",
        projectId: "instagram-clone-3e592",
        storageBucket: "instagram-clone-3e592.appspot.com",
        messagingSenderId: "409001483069",
        appId: "1:409001483069:web:3c9b5feaf5d3d7a58ec354",
        measurementId: "G-75RC4471PL"
      });
      const db =firebaseApp.firestore();
      const auth=firebase.auth();
      const storage=firebase.storage();
      export { db, auth, storage};
