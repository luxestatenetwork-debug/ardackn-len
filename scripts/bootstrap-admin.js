/**
 * Admin Bootstrap — Firebase REST API approach
 * Uses Firebase CLI token for auth
 */

const https = require('https');
const { execSync } = require('child_process');

const PROJECT_ID = 'lux-estate-network-iq9ga2';
const ADMIN_EMAIL = 'luxestatenetwork@gmail.com';
const API_KEY = 'AIzaSyCxtM4EyFRVh2OgzMnWYSOKAhNoxAabFcM';

function httpsPost(hostname, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...headers
      }
    };
    
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsGet(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path, method: 'GET', headers };
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function httpsPatch(hostname, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname,
      path,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...headers
      }
    };
    
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function bootstrapAdmin() {
  console.log(`\n🚀 Admin Bootstrap via Firebase REST API`);
  console.log(`📧 Target email: ${ADMIN_EMAIL}\n`);

  // Step 1: Sign in to get idToken
  console.log('🔑 Signing in...');
  const signInResult = await httpsPost(
    'identitytoolkit.googleapis.com',
    `/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      email: ADMIN_EMAIL,
      password: '18062023aE!',
      returnSecureToken: true
    }
  );

  if (signInResult.status !== 200 || !signInResult.body.localId) {
    // User might not exist yet, try to create
    if (signInResult.body?.error?.message === 'EMAIL_NOT_FOUND' ||
        signInResult.body?.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
      console.log('⚠️  User not found. Creating account...');
      const signUpResult = await httpsPost(
        'identitytoolkit.googleapis.com',
        `/v1/accounts:signUp?key=${API_KEY}`,
        {
          email: ADMIN_EMAIL,
          password: '18062023aE!',
          returnSecureToken: true
        }
      );
      
      if (signUpResult.status !== 200 || !signUpResult.body.localId) {
        console.error('❌ Could not create user:', JSON.stringify(signUpResult.body));
        process.exit(1);
      }
      
      const uid = signUpResult.body.localId;
      const idToken = signUpResult.body.idToken;
      console.log(`✅ Created user: ${uid}`);
      await writeFirestoreDoc(uid, idToken);
      return;
    }
    
    console.error('❌ Sign in failed:', JSON.stringify(signInResult.body));
    process.exit(1);
  }

  const uid = signInResult.body.localId;
  const idToken = signInResult.body.idToken;
  console.log(`✅ Signed in as: ${uid}`);
  
  await writeFirestoreDoc(uid, idToken);
}

async function writeFirestoreDoc(uid, idToken) {
  const now = new Date().toISOString();
  
  // Firestore document fields format
  const firestoreDoc = {
    fields: {
      uid: { stringValue: uid },
      email: { stringValue: ADMIN_EMAIL },
      displayName: { stringValue: 'Lux Estate Admin' },
      role: { stringValue: 'admin' },
      premium: { booleanValue: true },
      slots_purchased: { integerValue: '999' },
      slots_used: { integerValue: '0' },
      createdAt: { stringValue: now },
      updatedAt: { stringValue: now },
      lastLogin: { stringValue: now }
    }
  };

  const firestorePath = `/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;
  
  console.log('\n📝 Writing Firestore document...');
  
  const result = await httpsPatch(
    'firestore.googleapis.com',
    firestorePath,
    firestoreDoc,
    {
      'Authorization': `Bearer ${idToken}`
    }
  );

  if (result.status === 200) {
    console.log(`✅ Firestore document written successfully`);
    console.log(`\n🎉 Admin bootstrap complete!`);
    console.log(`   UID   : ${uid}`);
    console.log(`   Email : ${ADMIN_EMAIL}`);
    console.log(`   Role  : admin`);
    console.log(`\n   Login : http://localhost:3000/login`);
    console.log(`   Admin : http://localhost:3000/admin`);
  } else {
    console.error('❌ Failed to write Firestore document:', result.status, JSON.stringify(result.body).slice(0, 300));
    
    // This might be a permissions issue — the rules require admin role to write others' docs
    // But writing own doc is allowed, so this should work
    console.log('\n⚠️  Note: If this fails due to permissions, log in via the browser at http://localhost:3000/login');
    console.log('   The authStore will automatically set role:admin on first login for this email.');
  }
  
  process.exit(0);
}

bootstrapAdmin().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
