import admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
const cert = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKey
};

admin.initializeApp({
  credential: admin.credential.cert(cert)
});

const db = admin.firestore();

async function deleteAllProducts() {
  const snapshot = await db.collection('products').get();
  const batch = db.batch();
  let count = 0;
  
  snapshot.forEach(doc => {
    batch.delete(doc.ref);
    count++;
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`✓ Deleted ${count} products from Firebase`);
  } else {
    console.log('✓ No products to delete');
  }
  
  process.exit(0);
}

deleteAllProducts().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
