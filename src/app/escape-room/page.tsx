'use client';

import React, { useState, useEffect } from 'react';

export default function EscapeRoom() {
  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [manualTime, setManualTime] = useState(600);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [completedStages, setCompletedStages] = useState(new Set());
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({
    0: '', 1: '', 2: '', 3: ''
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t: number) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setFeedback('Time is up! You did not escape.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const executeCode = (code: string): string => {
    try {
      const output: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        output.push(args.map((arg: any) => JSON.stringify(arg)).join(' '));
      };
      
      const func = new Function(code);
      func();
      
      console.log = originalLog;
      return output.join('\n');
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  };

  const checkStage0 = (): void => {
    const code = userCode.trim();
    const output = executeCode(code);
    setCodeOutput(output);

    if (code.includes('function') && code.includes('return') && code.includes('+')) {
      setFeedback('CORRECT: Function that adds two numbers works!');
      setCompletedStages(new Set([...completedStages, 0]));
      setUserAnswers({ ...userAnswers, 0: code });
    } else {
      setFeedback('INCORRECT: Your code should contain a function that adds numbers. Try using function add(a, b) { return a + b; }');
    }
  };

  const checkStage1 = (): void => {
    const code = userCode.trim();
    const output = executeCode(code);
    setCodeOutput(output);

    try {
      const func = new Function('arr', code + '; return arr;');
      const testArr = [5, 2, 8, 1, 9];
      const result = func([...testArr]);
      const isSorted = result.every((v: number, i: number, a: number[]) => i === 0 || v >= a[i - 1]);
      
      if (isSorted && result.length === 5) {
        setFeedback('CORRECT: Array sorted successfully!');
        setCompletedStages(new Set([...completedStages, 1]));
        setUserAnswers({ ...userAnswers, 1: code });
      } else {
        setFeedback('INCORRECT: Array is not sorted. Use arr.sort((a, b) => a - b)');
      }
    } catch (error: any) {
      setFeedback(`ERROR: ${error.message}`);
    }
  };

  const checkStage2 = (): void => {
    const code = userCode.trim();
    const output = executeCode(code);
    setCodeOutput(output);

    try {
      const func = new Function('num', code + '; return num;');
      
      const testCases = [
        { input: 2, expected: true },
        { input: 4, expected: false },
        { input: 7, expected: true },
        { input: 10, expected: false }
      ];

      let allCorrect = true;
      for (const test of testCases) {
        const result = func(test.input);
        if (result !== test.expected) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        setFeedback('CORRECT: Prime number checker works!');
        setCompletedStages(new Set([...completedStages, 2]));
        setUserAnswers({ ...userAnswers, 2: code });
      } else {
        setFeedback('INCORRECT: Your function should return true for prime numbers (2, 3, 5, 7) and false for non-prime numbers.');
      }
    } catch (error: any) {
      setFeedback(`ERROR: ${error.message}`);
    }
  };

  const checkStage3 = (): void => {
    const code = userCode.trim();
    const output = executeCode(code);
    setCodeOutput(output);

    try {
      const func = new Function('str', code + '; return str;');
      
      const testCases = [
        { input: 'hello', expected: 'olleh' },
        { input: 'world', expected: 'dlrow' },
        { input: 'a', expected: 'a' }
      ];

      let allCorrect = true;
      for (const test of testCases) {
        const result = func(test.input);
        if (result !== test.expected) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        setFeedback('CORRECT: String reversal works!');
        setCompletedStages(new Set([...completedStages, 3]));
        setUserAnswers({ ...userAnswers, 3: code });
      } else {
        setFeedback('INCORRECT: Your function should reverse the string. Try using split, reverse, and join.');
      }
    } catch (error: any) {
      setFeedback(`ERROR: ${error.message}`);
    }
  };

  const handleCheck = (): void => {
    setCodeOutput('');
    if (stage === 0) checkStage0();
    else if (stage === 1) checkStage1();
    else if (stage === 2) checkStage2();
    else if (stage === 3) checkStage3();
  };

  const saveResults = async (): Promise<void> => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          stage: completedStages.size,
          completed: completedStages.size === 4,
          timeSpent: 600 - timeLeft,
          answers: JSON.stringify(userAnswers)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Results saved successfully!');
      } else {
        alert('Error saving: ' + data.error);
      }
    } catch (error: any) {
      alert('Network error: ' + error.message);
    }
    setSaving(false);
  };

  const escapeStatus = completedStages.size === 4;

  const stages = [
    {
      title: 'Stage 1: Simple Addition Function',
      description: 'Write a function that adds two numbers together.',
      example: 'Example: add(3, 5) should work',
      hint: 'Write a function called add with two parameters that returns their sum.'
    },
    {
      title: 'Stage 2: Sort an Array',
      description: 'Write code that sorts an array in ascending order.',
      example: 'Input: [5, 2, 8, 1, 9] Output: [1, 2, 5, 8, 9]',
      hint: 'Use arr.sort() with a comparison function: (a, b) => a - b'
    },
    {
      title: 'Stage 3: Check if Prime Number',
      description: 'Write a function that checks if a number is prime.',
      example: 'isPrime(7) returns true, isPrime(4) returns false',
      hint: 'A prime number is only divisible by 1 and itself. Numbers less than 2 are not prime.'
    },
    {
      title: 'Stage 4: Reverse a String',
      description: 'Write code that reverses a string.',
      example: 'Input: "hello" Output: "olleh"',
      hint: 'Use str.split(\'\').reverse().join(\'\') or a loop to reverse.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">Code Escape Room</h1>
          <p className="text-slate-400">Solve coding challenges to escape. {completedStages.size}/4 doors unlocked</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Timer</h2>
              <div className="text-6xl font-mono font-bold text-center mb-6 text-blue-400">
                {formatTime(timeLeft)}
              </div>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
                >
                  {timerActive ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setTimeLeft(manualTime);
                    setTimerActive(false);
                  }}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 py-2 rounded font-bold"
                >
                  Reset
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={Math.floor(manualTime / 60)}
                  onChange={(e) => setManualTime((parseInt(e.target.value) || 0) * 60)}
                  placeholder="Minutes"
                  className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600"
                />
                <button
                  onClick={() => setTimeLeft(manualTime)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Stage Content */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-2xl font-bold mb-2">{stages[stage].title}</h2>
              <p className="text-slate-300 mb-4">{stages[stage].description}</p>

              <div className="bg-slate-900 p-4 rounded mb-4 border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Example:</p>
                <p className="text-green-400 font-mono">{stages[stage].example}</p>
              </div>

              <label className="block text-sm font-bold mb-2">Your Code:</label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Write your JavaScript code here..."
                className="w-full h-48 bg-slate-900 text-white p-3 rounded border-2 border-slate-600 font-mono text-sm mb-4 focus:outline-none focus:border-blue-500"
              />

              {codeOutput && (
                <div className="bg-slate-900 p-3 rounded mb-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Output:</p>
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">
                    {codeOutput}
                  </pre>
                </div>
              )}

              <p className="text-slate-300 text-sm mb-4">Hint: {stages[stage].hint}</p>

              {feedback && (
                <div className={`p-3 rounded mb-4 text-sm font-bold border ${
                  feedback.includes('CORRECT') 
                    ? 'bg-green-900 text-green-200 border-green-700' 
                    : 'bg-red-900 text-red-200 border-red-700'
                }`}>
                  {feedback}
                </div>
              )}

              <button
                onClick={handleCheck}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mb-4"
              >
                Run and Check
              </button>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (stage > 0) setStage(stage - 1);
                    setUserCode('');
                    setCodeOutput('');
                    setFeedback('');
                  }}
                  disabled={stage === 0}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 py-2 rounded font-bold"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (stage < 3) setStage(stage + 1);
                    setUserCode('');
                    setCodeOutput('');
                    setFeedback('');
                  }}
                  disabled={stage === 3}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 py-2 rounded font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Door Status */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Door Status</h3>
              {stages.map((s, i) => (
                <div key={i} className="mb-3 p-3 bg-slate-700 rounded flex items-center gap-3">
                  <span className="text-2xl">
                    {completedStages.has(i) ? 'Unlocked' : 'Locked'}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Door {i + 1}</p>
                    <p className="text-xs text-slate-400">
                      {completedStages.has(i) ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Escape Status */}
            <div className={`rounded-lg p-6 border text-white ${
              escapeStatus 
                ? 'bg-green-900 border-green-700' 
                : 'bg-red-900 border-red-700'
            }`}>
              <h3 className="text-xl font-bold mb-2">
                {escapeStatus ? 'ESCAPED!' : 'TRAPPED'}
              </h3>
              <p className="text-sm mb-4">
                {escapeStatus 
                  ? `You escaped in ${formatTime(600 - timeLeft)}!` 
                  : `${4 - completedStages.size} more doors to unlock`}
              </p>
              {escapeStatus && (
                <button
                  onClick={() => setShowResults(true)}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-bold"
                >
                  View Results
                </button>
              )}
            </div>

            {/* Progress */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-3">Progress</h3>
              <div className="space-y-2 text-sm">
                <p>Completed: {completedStages.size}/4</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(completedStages.size / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 text-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-auto border border-slate-700">
            <h2 className="text-3xl font-bold mb-4">Results</h2>
            <div className="space-y-4 mb-6">
              {stages.map((s, i) => (
                <div key={i} className="bg-slate-700 p-4 rounded">
                  <p className="font-bold text-lg">{s.title}</p>
                  <p className="text-sm text-slate-400 mt-2">Your code:</p>
                  <pre className="bg-slate-900 p-2 rounded mt-2 text-xs overflow-x-auto text-green-400">
                    {userAnswers[i] || 'Not completed'}
                  </pre>
                  <p className="text-xs text-slate-400 mt-2">
                    {completedStages.has(i) ? 'Status: Completed' : 'Status: Not completed'}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveResults}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 rounded font-bold"
              >
                {saving ? 'Saving...' : 'Save to Database'}
              </button>
              <button
                onClick={() => setShowResults(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 py-2 rounded font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}