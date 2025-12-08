/**
 * EXAMPLE: How to add a contact form that saves to Firestore
 * 
 * This is a reference example showing how to integrate Firestore
 * with your existing ContactUs component.
 * 
 * You can copy parts of this code into your ContactUs.js file
 */

import React, { useState } from 'react';
import { addDocument } from '../firebase/firestoreService';

function ContactFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Save to Firestore
      await addDocument('contact_submissions', {
        ...formData,
        status: 'new',
        readStatus: false,
        source: 'website',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      // Success!
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: ''
      });

      // Optional: Send email notification (you'd need to set up Cloud Functions)
      // await sendEmailNotification(formData);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Get in Touch</h2>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+962 7 XXXX XXXX"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">Select a service</option>
            <option value="social-media">Social Media Management</option>
            <option value="marketing">Marketing Strategies</option>
            <option value="seo">SEO</option>
            <option value="branding">Branding & Identity</option>
            <option value="web-development">Web Development</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Tell us about your project..."
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="alert alert-success">
            ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="alert alert-error">
            ❌ Oops! Something went wrong. Please try again or contact us directly.
          </div>
        )}
      </form>
    </div>
  );
}

export default ContactFormExample;

/* ============================================
   CSS EXAMPLE (add to ContactUs.css)
   ============================================ */

/*
.contact-form-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0066ff;
  background: rgba(255, 255, 255, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-button {
  padding: 14px 32px;
  background: linear-gradient(90deg, #0052cc 0%, #0066ff 50%, #00a3ff 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
}

.alert-success {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #4ade80;
}

.alert-error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
}
*/

