'use client'; // Enables client-side React features (state, effects)

import { useState, useEffect } from 'react';

// Define Tab interface for TypeScript typing
interface Tab {
  heading: string;
  content: string;
}

export default function Home() {
  // State for tabs array (up to 15), new tab inputs, and generated output
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [newHeading, setNewHeading] = useState('');
  const [newContent, setNewContent] = useState('');
  const [output, setOutput] = useState('');

  // Load tabs from localStorage on page load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tabs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTabs(parsed.slice(0, 15)); // Limit to 15 on load
        }
      }
    } catch (error) {
      console.error('Error loading tabs from localStorage:', error);
      setTabs([]); // Reset if invalid
    }
  }, []);

  // Save tabs to localStorage whenever tabs change
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('tabs', JSON.stringify(tabs));
    } else {
      localStorage.removeItem('tabs'); // Clear if no tabs
    }
  }, [tabs]);

  // Add a new tab (limit to 15)
  const addTab = () => {
    if (tabs.length >= 15) {
      alert('Maximum 15 tabs allowed.');
      return;
    }
    const newTab = {
      heading: newHeading.trim() || `Tab ${tabs.length + 1}`,
      content: newContent.trim() || 'Default content',
    };
    setTabs([...tabs, newTab]);
    setNewHeading('');
    setNewContent('');
  };

  // Remove a tab by index
  const removeTab = (index: number) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);
  };

  // Update tab heading or content by index
  const updateTab = (index: number, field: 'heading' | 'content', value: string) => {
    const updatedTabs = [...tabs];
    updatedTabs[index][field] = value.trim();
    setTabs(updatedTabs);
  };

  // Generate HTML+JS output with inline CSS only
  const generateOutput = () => {
    if (tabs.length === 0) {
      setOutput('No tabs to generate.');
      return;
    }

    let html = '<!DOCTYPE html><html lang="en"><head><title>Tabs Example</title></head><body>';
    html += '<div style="border: 1px solid #ccc; padding: 10px; max-width: 800px; margin: 0 auto;">';

    // Generate radio inputs and labels for tabs (inline styles)
    tabs.forEach((tab, i) => {
      html += `<input type="radio" id="tab${i}" name="tabs" style="display: none;" ${i === 0 ? 'checked' : ''}>`;
      html += `<label for="tab${i}" style="display: inline-block; padding: 10px 20px; background-color: #f0f0f0; cursor: pointer; margin-right: 5px; border: 1px solid #ccc; border-bottom: none; border-radius: 5px 5px 0 0;">${tab.heading}</label>`;
    });

    // Generate content divs (hidden except first)
    tabs.forEach((tab, i) => {
      html += `<div id="content${i}" style="display: ${i === 0 ? 'block' : 'none'}; padding: 20px; border: 1px solid #ccc; border-radius: 0 0 5px 5px;">${tab.content}</div>`;
    });

    html += '</div>';

    // Inline JS for tab switching
    html += '<script>';
    html += 'document.querySelectorAll(\'input[name="tabs"]\').forEach((radio, i) => {';
    html += '  radio.addEventListener("change", () => {';
    html += '    document.querySelectorAll(\'[id^="content"]\').forEach(c => c.style.display = "none");';
    html += '    document.getElementById("content" + i).style.display = "block";';
    html += '  });';
    html += '});';
    html += '</script>';

    html += '</body></html>';

    setOutput(html);
  };

  return (
    <main className="p-4 max-w-4xl mx-auto text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Tabs Generator</h1>
      {/* New Tab Form */}
      <div className="mb-6 border p-4 rounded-lg bg-white dark:bg-gray-800">
        <label htmlFor="new-heading" className="block mb-2 font-semibold">New Tab Heading:</label>
        <input
          id="new-heading"
          type="text"
          value={newHeading}
          onChange={(e) => setNewHeading(e.target.value)}
          placeholder="Enter tab heading"
          className="p-2 border rounded w-full mb-4 text-black dark:text-white bg-white dark:bg-gray-700"
          aria-label="New tab heading"
        />
        <label htmlFor="new-content" className="block mb-2 font-semibold">New Tab Content:</label>
        <textarea
          id="new-content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Enter tab content"
          className="p-2 border rounded w-full mb-4 text-black dark:text-white bg-white dark:bg-gray-700"
          rows={4}
          aria-label="New tab content"
        />
        <button
          onClick={addTab}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          aria-label="Add new tab"
        >
          + Add Tab
        </button>
      </div>

      {/* Existing Tabs List */}
      <div role="region" aria-label="Existing tabs list">
        {tabs.map((tab, i) => (
          <div key={i} className="mb-6 border p-4 rounded-lg bg-white dark:bg-gray-800">
            <label htmlFor={`heading-${i}`} className="block mb-2 font-semibold">Tab ${i + 1} Heading:</label>
            <input
              id={`heading-${i}`}
              type="text"
              value={tab.heading}
              onChange={(e) => updateTab(i, 'heading', e.target.value)}
              className="p-2 border rounded w-full mb-4 text-black dark:text-white bg-white dark:bg-gray-700"
              aria-label={`Edit tab ${i + 1} heading`}
            />
            <label htmlFor={`content-${i}`} className="block mb-2 font-semibold">Tab ${i + 1} Content:</label>
            <textarea
              id={`content-${i}`}
              value={tab.content}
              onChange={(e) => updateTab(i, 'content', e.target.value)}
              className="p-2 border rounded w-full mb-4 text-black dark:text-white bg-white dark:bg-gray-700"
              rows={4}
              aria-label={`Edit tab ${i + 1} content`}
            />
            <button
              onClick={() => removeTab(i)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              aria-label={`Remove tab ${i + 1}`}
            >
              - Remove Tab
            </button>
          </div>
        ))}
      </div>

      {/* Generate Output Button */}
      <button
        onClick={generateOutput}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-6"
        aria-label="Generate HTML output"
      >
        Generate Output Code
      </button>

      {/* Output Textarea */}
      {output && (
        <div className="mb-4">
          <label htmlFor="output-code" className="block mb-2 font-semibold">Generated HTML Code (Copy and Paste into hello.html):</label>
          <textarea
            id="output-code"
            readOnly
            value={output}
            className="w-full h-64 p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700 font-mono text-sm"
            aria-label="Generated HTML code"
          />
          <p className="mt-2 text-sm">Paste this into a .html file and open in a web browser to test. It uses only inline CSS and JS for tab switching.</p>
        </div>
      )}
    </main>
  );
}

// Assisted by Grok for code structure and logic.