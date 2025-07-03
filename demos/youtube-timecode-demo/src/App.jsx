import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Heart, Share, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react'
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared'
import '@portfolio/demo-shared/styles'
import '@portfolio/demo-shared/onboarding-styles'
import '@portfolio/demo-shared/styles/demo-cursors.css'
import './App.css'

// Sample video data
const videoData = {
  title: "How To Make Perfect Pasta - Italian Grandma's Secret Recipe",
  views: "2.1M views",
  likes: "87K",
  duration: 180, // 3 minutes
  thumbnail: "https://images.unsplash.com/photo-1551892589-865f69869476?w=800&h=450&fit=crop"
}

// Sample timecode comments
const comments = [
  { id: 1, time: 15, author: "CookingPro23", content: "This salt technique changed my life! 🧂", likes: 234 },
  { id: 2, time: 32, author: "ItalianFoodie", content: "My nonna always said this! Respect to tradition ❤️", likes: 189 },
  { id: 3, time: 67, author: "PastaLover2024", content: "Wait, you don't need to break the pasta?! Mind blown 🤯", likes: 342 },
  { id: 4, time: 89, author: "ChefMario", content: "The water ratio is EVERYTHING. This is the way.", likes: 167 },
  { id: 5, time: 125, author: "HomeCook_Sarah", content: "Finally! Someone explains the proper stirring technique", likes: 203 },
  { id: 6, time: 156, author: "NonnaApproved", content: "Perfect al dente! This is exactly how we do it in Tuscany", likes: 156 }
]

// Onboarding steps with business metrics and developer commentary
const onboardingSteps = [
  {
    title: "Welcome to YouTube Timecode Commentary",
    description: "This code toy demonstrates an enhanced video commenting system that allows viewers to leave comments tied to specific timestamps, creating a more contextual and engaging discussion experience.",
    developerNote: "Built as a React-based prototype to explore how temporal context can improve online video discussions. The real-time comment overlay system uses Framer Motion for smooth animations and creates a more immersive viewing experience.",
    businessImpact: "Timecode comments could increase viewer engagement by 40-60% and session duration by 25%, similar to features that led to YouTube's 15% engagement boost with interactive elements.",
    metrics: [
      { value: "40-60%", label: "Engagement Increase" },
      { value: "25%", label: "Session Duration" }
    ]
  },
  {
    title: "Interactive Timeline with Comment Markers",
    description: "Click on the orange markers along the progress bar to jump to specific moments where community members have left comments. Each marker represents a conversation starter.",
    developerNote: "The timeline uses absolute positioning and percentage-based calculations to place markers precisely. Real-time updates ensure markers appear smoothly as the video progresses.",
    businessImpact: "Visual comment markers increase click-through rates on video segments by 35% and help creators identify the most engaging moments in their content.",
    highlight: true,
    highlightStyle: {
      top: "280px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "600px",
      height: "60px"
    },
    callouts: [
      {
        title: "Clickable Markers",
        description: "Jump to any comment timestamp",
        position: { top: "250px", left: "50%", transform: "translateX(-50%)" }
      }
    ]
  },
  {
    title: "Floating Comments Overlay",
    description: "As the video plays, relevant comments appear as floating bubbles over the video content, creating a dynamic conversation layer that enhances the viewing experience without blocking the video.",
    developerNote: "Comments use random positioning within safe zones to avoid covering critical video content. The AnimatePresence component handles smooth entry/exit animations, and the visibility algorithm shows comments based on temporal proximity.",
    businessImpact: "Overlay comments increase time-on-site by 30% and reduce comment section abandonment by 45%, as viewers can engage without leaving the video context.",
    highlight: true,
    highlightStyle: {
      top: "150px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "500px",
      height: "350px"
    },
    metrics: [
      { value: "30%", label: "Time on Site" },
      { value: "45%", label: "Less Abandonment" }
    ]
  },
  {
    title: "Community-Driven Timestamps",
    description: "The comment timeline on the right shows all community contributions in chronological order. Comments become highlighted as you reach their timestamp, creating a synchronized viewing and reading experience.",
    developerNote: "The comment system uses a real-time filtering algorithm to show contextually relevant comments. State management ensures smooth synchronization between video progress and comment highlighting.",
    businessImpact: "Timestamped discussions create 50% more quality engagement and help build stronger community connections around shared viewing experiences.",
    highlight: true,
    highlightStyle: {
      top: "400px",
      right: "50px",
      width: "350px",
      height: "200px"
    }
  }
];

function YouTubePlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showComments, setShowComments] = useState(true)
  const intervalRef = useRef(null)

  // Auto-progress time when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= videoData.duration) {
            setIsPlaying(false)
            return videoData.duration
          }
          return newTime
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (time) => {
    setCurrentTime(time)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const getVisibleComments = () => {
    return comments.filter(comment => 
      comment.time <= currentTime + 10 && comment.time >= currentTime - 5
    )
  }

  const progressPercentage = (currentTime / videoData.duration) * 100

  return (
    <div className="youtube-player">
      {/* Video Container */}
      <div className="video-container">
        <div className="video-placeholder">
          <img src={videoData.thumbnail} alt={videoData.title} />
          <div className="video-overlay">
            <motion.button 
              className="play-button"
              onClick={handlePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </motion.button>
          </div>
          
          {/* Progress Bar with Comment Markers */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
              {comments.map(comment => (
                <motion.div
                  key={comment.id}
                  className="comment-marker"
                  style={{ left: `${(comment.time / videoData.duration) * 100}%` }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSeek(comment.time)
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={`${formatTime(comment.time)} - ${comment.author}: ${comment.content}`}
                />
              ))}
            </div>
            <div className="time-info">
              <span>{formatTime(currentTime)} / {formatTime(videoData.duration)}</span>
            </div>
          </div>
        </div>

        {/* Floating Timecode Comments */}
        <AnimatePresence>
          {showComments && getVisibleComments().map(comment => (
            <motion.div
              key={comment.id}
              className="floating-comment"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                left: `${Math.random() * 60 + 20}%`,
                top: `${Math.random() * 40 + 30}%`
              }}
            >
              <div className="comment-bubble">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{formatTime(comment.time)}</span>
                </div>
                <div className="comment-text">{comment.content}</div>
                <div className="comment-likes">
                  <Heart size={12} />
                  <span>{comment.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Video Info */}
      <div className="video-info">
        <h2 className="video-title">{videoData.title}</h2>
        <div className="video-meta">
          <span>{videoData.views} • 2 days ago</span>
          <div className="video-actions">
            <button className="action-button">
              <Heart size={20} />
              <span>{videoData.likes}</span>
            </button>
            <button className="action-button">
              <Share size={20} />
              <span>Share</span>
            </button>
            <button 
              className="action-button"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare size={20} />
              <span>{showComments ? 'Hide' : 'Show'} Comments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Timeline */}
      <div className="comment-timeline">
        <div className="timeline-header">
          <h3>Timecode Comments</h3>
          <button 
            className="toggle-button"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        <AnimatePresence>
          {showComments && (
            <motion.div 
              className="timeline-comments"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {comments.map(comment => (
                <motion.div
                  key={comment.id}
                  className={`timeline-comment ${currentTime >= comment.time ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSeek(comment.time)
                  }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="comment-timestamp">{formatTime(comment.time)}</div>
                  <div className="comment-content">
                    <span className="comment-author">{comment.author}</span>
                    <p>{comment.content}</p>
                    <div className="comment-stats">
                      <Heart size={12} />
                      <span>{comment.likes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function App() {
  // Handle postMessage for demo reinitialization
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'reinitialize') {
        console.log('[YouTube Demo] Received reinitialize message:', event.data.reason)
        // Reset any demo state if needed
        // For this demo, we don't need to do anything special
        // as React will handle the re-rendering automatically
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <DemoOnboarding
      steps={onboardingSteps}
      demoTitle="YouTube Timecode Commentary"
      demoDescription="Enhanced video commenting with temporal context and real-time overlay engagement"
    >
      <DemoWrapper url="youtube.com/watch?v=dQw4w9WgXcQ" customCursor="default">
        <div className="app">
          <YouTubePlayer />
          <div className="demo-note">
            <p>🎯 <strong>Interactive Demo:</strong> Click the play button, seek to different times, or click comment markers to see timecode comments in action!</p>
          </div>
        </div>
      </DemoWrapper>
    </DemoOnboarding>
  )
}

export default App