// Import required libraries
const {PubSub} = require('@google-cloud/pubsub');
const {Firestore} = require('@google-cloud/firestore');

// Instantiates clients
const firestore = new Firestore();
const pubsub = new PubSub();

// Function triggered by PubSub
exports.processMessage = (message, context) => {
  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');
  const parsedMessage = JSON.parse(incomingMessage);
  
  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);

  // Prepare document data for Firestore
  const documentData = {
    email_address: parsedMessage.email_address,
    watch_regions: parsedMessage.watch_regions
  };

  // Add document to Firestore
  return firestore.collection('subscribers').add(documentData)
    .then(docRef => {
      console.log(`Document written with ID: ${docRef.id}`);
    })
    .catch(error => {
      console.error(`Error adding document: ${error}`);
    });
};
