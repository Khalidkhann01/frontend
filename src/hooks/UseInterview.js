// hooks/UseInterview.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useInterview() {
  const router = useRouter();
  const isMounted = useRef(true);
  const [state, setState] = useState({
    step: 'upload',
    sessionId: null,
    firstName: '',
    _email: '',
    cvResult: null,
    jobMatch: null,
    mismatch: null,
    currentQuestion: null,
    lastFeedback: null,
    report: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const processedEvents = useRef(new Set());
  const questionTimeout = useRef(null);

  // Initialize session
  useEffect(() => {
    if (!state.sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      if (isMounted.current) {
        setState(prev => ({ ...prev, sessionId: newSessionId }));
      }
    }
  }, []);

  // Setup SSE connection
  useEffect(() => {
    if (!state.sessionId || state.step === 'upload') return;

    console.log('🔄 Setting up SSE connection for session:', state.sessionId);
    
    if (eventSource) {
      eventSource.close();
    }

    const es = new EventSource(`${API_URL}/stream/${state.sessionId}`);
    setEventSource(es);

    // Handle sync event (reconnect)
    es.addEventListener('sync', (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('🔄 Sync received:', data);
      } catch (error) {
        console.error('Error parsing sync:', error);
      }
    });

    // Handle CV result
    es.addEventListener('cv_result', (e) => {
      try {
        const data = JSON.parse(e.data);
        const eventId = `cv_${data.sessionId || state.sessionId}`;
        
        if (processedEvents.current.has(eventId)) {
          console.log('⏭️ Skipping duplicate CV result');
          return;
        }
        processedEvents.current.add(eventId);
        
        console.log('📄 CV Result received:', data);
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'analyzing' || prev.step === 'upload') {
              return {
                ...prev,
                cvResult: data,
                step: 'set_job',
                firstName: data.candidateName || prev.firstName
              };
            }
            return prev;
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing cv_result:', error);
      }
    });

    // Handle job match
    es.addEventListener('job_match', (e) => {
      try {
        const data = JSON.parse(e.data);
        const eventId = `match_${data.sessionId || state.sessionId}`;
        
        if (processedEvents.current.has(eventId)) {
          console.log('⏭️ Skipping duplicate job match');
          return;
        }
        processedEvents.current.add(eventId);
        
        console.log('✅ Job Match received:', data);
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'matching' || prev.step === 'set_job') {
              return {
                ...prev,
                jobMatch: data,
                step: 'ready'
              };
            }
            return prev;
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing job_match:', error);
      }
    });

    // Handle mismatch
    es.addEventListener('mismatch_roles', (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('❌ Mismatch received:', data);
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'matching') {
              return {
                ...prev,
                mismatch: data,
                step: 'mismatch'
              };
            }
            return prev;
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing mismatch:', error);
      }
    });

    // Handle question
    es.addEventListener('question', (e) => {
      try {
        const data = JSON.parse(e.data);
        const questionNum = data.questionNumber || 0;
        const eventId = `q_${state.sessionId}_${questionNum}`;
        
        // Check if already processed
        if (processedEvents.current.has(eventId)) {
          console.log(`⏭️ Skipping duplicate question ${questionNum}`);
          return;
        }
        
        console.log('❓ Question received:', data);
        
        // Clear timeout since we got a question
        if (questionTimeout.current) {
          clearTimeout(questionTimeout.current);
          questionTimeout.current = null;
        }
        
        if (isMounted.current) {
          setState(prev => {
            const currentQNum = prev.currentQuestion?.questionNumber || 0;
            
            // Only update if this is a newer question or first question
            if (questionNum > currentQNum || !prev.currentQuestion) {
              processedEvents.current.add(eventId);
              return {
                ...prev,
                currentQuestion: data,
                step: 'interview',
                loading: false
              };
            }
            return prev;
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing question:', error);
      }
    });

    // Handle feedback
    es.addEventListener('score_feedback', (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('💬 Feedback received:', data);
        if (isMounted.current) {
          setState(prev => ({
            ...prev,
            lastFeedback: data
          }));
        }
      } catch (error) {
        console.error('Error parsing feedback:', error);
      }
    });

    // 🔥 NEW: Handle combined feedback + question event
    es.addEventListener('question_with_feedback', (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('📦 Combined event received:', data);
        
        // Clear timeout since we got a response
        if (questionTimeout.current) {
          clearTimeout(questionTimeout.current);
          questionTimeout.current = null;
        }
        
        if (isMounted.current) {
          // Update feedback
          setState(prev => ({
            ...prev,
            lastFeedback: data.feedback,
            // Update question to the next one
            currentQuestion: data.nextQuestion,
            step: 'interview',
            loading: false
          }));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing combined event:', error);
      }
    });

    // Handle interview done
    es.addEventListener('interview_done', (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('🏁 Interview done:', data);
        if (isMounted.current) {
          setState(prev => ({
            ...prev,
            step: 'generating_report',
            loading: true
          }));
        }
      } catch (error) {
        console.error('Error parsing interview_done:', error);
      }
    });

    // Handle report
    es.addEventListener('report_ready', (e) => {
      try {
        const data = JSON.parse(e.data);
        const eventId = `report_${state.sessionId}`;
        
        if (processedEvents.current.has(eventId)) {
          console.log('⏭️ Skipping duplicate report');
          return;
        }
        processedEvents.current.add(eventId);
        
        console.log('📊 Report received:', data);
        if (isMounted.current) {
          setState(prev => {
            if (prev.step !== 'done') {
              return {
                ...prev,
                report: data,
                step: 'done',
                loading: false
              };
            }
            return prev;
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing report:', error);
        if (isMounted.current) {
          setState(prev => ({
            ...prev,
            error: 'Failed to generate report',
            step: 'done',
            loading: false
          }));
          setLoading(false);
        }
      }
    });

    // Handle done
    es.addEventListener('done', (e) => {
      console.log('🏁 Stream done');
      es.close();
      setEventSource(null);
    });

    // Handle errors
    es.onerror = (e) => {
      console.error('SSE Error:', e);
    };

    return () => {
      es.close();
      setEventSource(null);
    };
  }, [state.sessionId, state.step]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
      if (questionTimeout.current) {
        clearTimeout(questionTimeout.current);
        questionTimeout.current = null;
      }
    };
  }, []);

  // Upload CV
  const uploadCV = useCallback(async (file, firstName) => {
    setLoading(true);
    if (isMounted.current) {
      setState(prev => ({ ...prev, step: 'analyzing', firstName, error: null }));
    }

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_URL}/api/upload-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          firstName,
          fileBase64: base64,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      console.log('📤 Upload response:', data);
      
      setTimeout(() => {
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'analyzing') {
              return { ...prev, step: 'set_job' };
            }
            return prev;
          });
          setLoading(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Upload error:', error);
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to upload CV',
          step: 'upload'
        }));
        setLoading(false);
      }
    }
  }, [state.sessionId]);

  // Set job
  const setJob = useCallback(async (jobTitle, jobDescription) => {
    setLoading(true);
    if (isMounted.current) {
      setState(prev => ({ ...prev, step: 'matching', error: null }));
    }

    try {
      const response = await fetch(`${API_URL}/api/set-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          jobTitle,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to set job');
      }

      const data = await response.json();
      console.log('📤 Set job response:', data);

      setTimeout(() => {
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'matching') {
              return { ...prev, step: 'ready' };
            }
            return prev;
          });
          setLoading(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Set job error:', error);
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to set job',
          step: 'set_job'
        }));
        setLoading(false);
      }
    }
  }, [state.sessionId]);

  // Start interview
  const startInterview = useCallback(async () => {
    setLoading(true);
    if (isMounted.current) {
      setState(prev => ({ ...prev, step: 'generating_questions', error: null }));
    }

    try {
      const response = await fetch(`${API_URL}/api/start-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start interview');
      }

      const data = await response.json();
      console.log('📤 Start interview response:', data);
      
      if (questionTimeout.current) {
        clearTimeout(questionTimeout.current);
      }
      questionTimeout.current = setTimeout(() => {
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'generating_questions' && !prev.currentQuestion) {
              return {
                ...prev,
                error: 'Interview timed out. Please try again.',
                step: 'ready',
                loading: false
              };
            }
            return prev;
          });
          setLoading(false);
        }
      }, 15000);

    } catch (error) {
      console.error('Start interview error:', error);
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to start interview',
          step: 'ready'
        }));
        setLoading(false);
      }
    }
  }, [state.sessionId]);

  // Submit answer
  const submitAnswer = useCallback(async (answer) => {
    setLoading(true);
    if (isMounted.current) {
      setState(prev => ({ ...prev, lastFeedback: null, error: null }));
    }

    try {
      const response = await fetch(`${API_URL}/api/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit answer');
      }

      const data = await response.json();
      console.log('📤 Answer submitted:', data);

      if (data.done) {
        if (isMounted.current) {
          setState(prev => ({
            ...prev,
            step: 'generating_report',
            loading: true
          }));
        }
      }

      setTimeout(() => {
        if (isMounted.current) {
          setState(prev => {
            if (prev.step === 'interview') {
              return { ...prev, loading: false };
            }
            return prev;
          });
          setLoading(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Submit answer error:', error);
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to submit answer',
          loading: false
        }));
        setLoading(false);
      }
    }
  }, [state.sessionId]);

  // Reset
  const reset = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    if (questionTimeout.current) {
      clearTimeout(questionTimeout.current);
      questionTimeout.current = null;
    }
    processedEvents.current = new Set();
    if (isMounted.current) {
      setState({
        step: 'upload',
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName: '',
        _email: '',
        cvResult: null,
        jobMatch: null,
        mismatch: null,
        currentQuestion: null,
        lastFeedback: null,
        report: null,
        error: null,
      });
      setLoading(false);
    }
  }, [eventSource]);

  return {
    state,
    loading,
    uploadCV,
    setJob,
    startInterview,
    submitAnswer,
    reset,
  };
}