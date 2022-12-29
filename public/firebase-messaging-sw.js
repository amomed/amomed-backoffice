importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyAh-ftn6ggpTtZ_0qrVYDXaX5vqT_Pgm_E",
    authDomain: "amomed-acd60.firebaseapp.com",
    projectId: "amomed-acd60",
    storageBucket: "amomed-acd60.appspot.com",
    messagingSenderId: "322175485460",
    appId: "1:322175485460:web:05e9395b6ca7da553c4901",
    measurementId: "G-D5XEWDBFZS"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = "nouvelle commande";
  const notificationOptions = {
    body: payload.data.message,
    icon: './assets/layout/images/logo.png',
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});