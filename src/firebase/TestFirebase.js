// Simple Firebase Test Component
// Use this to verify your Firebase integration is working

import React, { useState } from 'react';
import { submitContactForm } from './index';

function TestFirebase() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...');

    try {
      // Test submitting a contact form
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        message: 'This is a test message from Firebase integration test.',
      };

      const docId = await submitContactForm(testData);
      
      setStatus(`✅ SUCCESS! Firebase is working correctly.\nDocument ID: ${docId}\n\nCheck your Firebase Console > Firestore Database > contacts collection to see the test data.`);
    } catch (error) {
      setStatus(`❌ ERROR: ${error.message}\n\nMake sure you have:\n1. Updated .env file with your Firebase credentials\n2. Enabled Firestore Database in Firebase Console\n3. Restarted your development server`);
      console.error('Firebase test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '600px',
      margin: '50px auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        🔥 Firebase Integration Test
      </h2>
      
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Click the button below to test if Firebase is properly configured.
      </p>

      <button
        onClick={testFirebaseConnection}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#0066ff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Testing...' : 'Test Firebase Connection'}
      </button>

      {status && (
        <div style={{
          padding: '15px',
          backgroundColor: status.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          color: status.includes('SUCCESS') ? '#155724' : '#721c24',
          borderRadius: '5px',
          whiteSpace: 'pre-wrap',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {status}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3 style={{ marginBottom: '10px' }}>Quick Setup Checklist:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>✓ Firebase SDK installed (v12.6.0)</li>
          <li>Update .env file with your Firebase credentials</li>
          <li>Enable Firestore Database in Firebase Console</li>
          <li>Restart development server (npm start)</li>
        </ul>
        <p style={{ marginTop: '15px' }}>
          📚 See <strong>FIREBASE_SETUP.md</strong> for detailed instructions.
        </p>
      </div>
    </div>
  );
}

export default TestFirebase;

// TO USE THIS TEST COMPONENT:
// 1. Import it in your App.js:
//    import TestFirebase from './firebase/TestFirebase';
//
// 2. Add it to your component tree:
//    <TestFirebase />
//
// 3. Visit your app in the browser and click the test button
//
// 4. Remove this component once Firebase is confirmed working

