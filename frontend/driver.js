// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaym4PPpkIpH4P0FFfYmNN2HAZ4BJ7z1Y",
    authDomain: "cblv3-735ec.firebaseapp.com",
    projectId: "cblv3-735ec",
    storageBucket: "cblv3-735ec.firebasestorage.app",
    messagingSenderId: "204148747598",
    appId: "1:204148747598:web:c59b67917d5843b87d821f",
    measurementId: "G-D3HT3V6J2G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Authentication logic
const auth = firebase.auth();

// Login function
function login() {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error logging in:', error);
        });
}

// Register function
function register() {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User registered:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error registering:', error);
        });
}

document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);

// Display message to user
function displayMessage(text, isError = false) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = text;
    if (isError) {
        messageElement.style.color = 'red';
    } else {
        messageElement.style.color = 'green';
    }
    document.getElementById('driver-app').appendChild(messageElement);
    setTimeout(() => messageElement.remove(), 3000);
}

// Accept booking function
function acceptBooking(bookingId) {
    const bookingRef = firebase.database().ref('bookings/' + bookingId);
    bookingRef.update({
        status: 'accepted'
    }).then(() => {
        displayMessage('Booking accepted successfully!');
    }).catch((error) => {
        displayMessage('Error accepting booking: ' + error.message, true);
    });
}

// Decline booking function
function declineBooking(bookingId) {
    const bookingRef = firebase.database().ref('bookings/' + bookingId);
    bookingRef.update({
        status: 'declined'
    }).then(() => {
        displayMessage('Booking declined successfully!');
    }).catch((error) => {
        displayMessage('Error declining booking: ' + error.message, true);
    });
}

// Placeholder for booking request listener
function listenForBookings() {
    const userId = auth.currentUser.uid;
    const bookingsRef = firebase.database().ref('bookings');
    bookingsRef.on('child_added', (snapshot) => {
        const booking = snapshot.val();
        if (booking.driverId === userId && booking.status === 'pending') {
            console.log('New booking request:', snapshot.key);
            // Placeholder for UI to accept/decline
        }
    });
}

listenForBookings();

// Send message function
function sendMessage() {
    const message = prompt('Enter your message:');
    const riderId = prompt('Enter rider ID to message:');
    const userId = auth.currentUser.uid;
    if (!message || !riderId) {
        displayMessage('Message and rider ID are required.', true);
        return;
    }
    const messageRef = firebase.database().ref('messages').push();
    messageRef.set({
        senderId: userId,
        receiverId: riderId,
        text: message,
        timestamp: Date.now()
    }).then(() => {
        displayMessage('Message sent successfully!');
    }).catch((error) => {
        displayMessage('Error sending message: ' + error.message, true);
    });
}

// Listen for messages function
function listenForMessages() {
    const userId = auth.currentUser.uid;
    const messagesRef = firebase.database().ref('messages');
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        if (message.receiverId === userId) {
            console.log('New message:', message.text);
        }
    });
}

listenForMessages();
document.getElementById('send-msg-btn').addEventListener('click', sendMessage);
