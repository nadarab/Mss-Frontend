import React, { useState, useEffect } from 'react';
import { addDocument, getAllDocuments, deleteDocument } from '../firebase/firestoreService';

/**
 * Test component to verify Firestore is working
 * You can remove this file after testing
 */
function TestFirestore() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  // Load items when component mounts
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getAllDocuments('test_collection');
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setLoading(true);
    try {
      await addDocument('test_collection', {
        name: newItem,
        timestamp: new Date().toISOString()
      });
      setNewItem('');
      await loadItems(); // Reload the list
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('test_collection', id);
      await loadItems(); // Reload the list
      alert('Item deleted!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff' }}>🔥 Firestore Test</h2>
      
      <form onSubmit={handleAdd} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter test item..."
          style={{
            padding: '10px',
            width: '70%',
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      <div>
        <h3 style={{ color: '#fff' }}>Items in Database:</h3>
        {items.length === 0 ? (
          <p style={{ color: '#aaa' }}>No items yet. Add one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: '#fff' }}>{item.name}</strong>
                  <br />
                  <small style={{ color: '#aaa' }}>ID: {item.id}</small>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: '8px 15px',
                    background: '#ff4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>
        <p style={{ color: '#4ade80', margin: 0 }}>
          ✅ If you can add/delete items, Firestore is working perfectly!
        </p>
      </div>
    </div>
  );
}

export default TestFirestore;

