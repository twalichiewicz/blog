---
title: YouTube timecode comments
date: 2025-06-25 15:30:00
short: true
tags:
  - blog
---

What if YouTube borrowed SoundCloud's timecode comments—letting viewers pin insights to exact moments?

YouTube comments already lean heavily on timestamps. Livestream VODs use third-party tools to overlay chat reactions. And if a user doesn't want to see them? Just add a toggle in settings.

{% raw %}
<!-- Modern 2025 Linear-style Wrapper -->
<div class="linear-prototype-wrapper" style="position: relative; margin: 32px auto; max-width: 100%; padding: 48px 24px 24px; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);">
  
  <!-- Clean Live Demo Badge -->
  <div class="live-demo-badge" style="position: absolute; top: 16px; left: 24px; z-index: 10;">
    <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: #ffffff; border-radius: 20px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
      <!-- Pulse indicator -->
      <div style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; position: relative;">
        <div style="position: absolute; inset: -2px; background: #10b981; border-radius: 50%; opacity: 0.4; animation: modernPulse 2s ease-in-out infinite;"></div>
      </div>
      <span class="prototype-label" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: -0.01em;">Interactive Prototype</span>
      <button class="prototype-toggle" style="margin-left: 8px; padding: 2px 8px; background: #e5e7eb; border: none; border-radius: 12px; color: #374151; font-size: 10px; font-weight: 600; cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif; transition: all 0.2s ease;">OFF</button>
    </div>
  </div>

<div class="youtube-demo" data-playing="false" data-current-time="5" data-duration="15" style="margin: 20px 0; background: #0f0f0f; max-width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);">
  
  <div style="position: relative; background: #000; padding-bottom: 56.25%; overflow: hidden;">
    <img class="video-gif" src="/2025/06/25/YouTube-Timecode-Commentary/cat.gif" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 0; margin-top: 0; margin-bottom: 0; pointer-events: none; border: none;">
    
    <!-- Comments are now displayed as tooltips on timeline markers -->
    
    <!-- Tooltip container - separate from controls so they stay visible -->
    <div class="tooltip-container" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 20;">
      <!-- Tooltips will be dynamically positioned here -->
    </div>
    
    <div class="controls-wrapper">
      <div class="progress-bar" style="position: relative; height: 3px; background: rgba(255,255,255,0.3); margin-bottom: 8px; cursor: pointer;">
        <div class="progress-fill" style="height: 100%; background: #ff0000; width: 33%; transition: width 0.1s linear; position: relative;">
          <div style="position: absolute; right: -6px; top: -5px; width: 12px; height: 12px; background: #ff0000; border-radius: 50%; box-shadow: 0 0 0 4px rgba(255,0,0,0.2);"></div>
        </div>
        <!-- Timeline markers for all comments -->
        <div class="timeline-marker" data-time="2" data-comment-id="1" data-username="@TomNook" data-full-text="Already vibing 🎶" style="position: absolute; left: 13.33%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
        <div class="timeline-marker" data-time="4" data-comment-id="2" data-username="@CatLover2024" data-full-text="The way crumb bobs to the beat here is EVERYTHING 😸" style="position: absolute; left: 26.67%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
        <div class="timeline-marker" data-time="6" data-comment-id="3" data-username="@NostalgicGamer" data-full-text="This takes me back to Saturday afternoons" style="position: absolute; left: 40%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
        
        <!-- Dense cluster for popular section (8-10 seconds) -->
        <div class="timeline-marker" data-time="8" data-comment-id="4" data-username="@VirtuallyVibe" data-full-text="HERE COMES THE BEST PART!! 🔥🔥🔥" style="position: absolute; left: 53.33%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
        <div class="timeline-marker" data-time="9" data-comment-id="5" data-username="@DanceCat" data-full-text="My cat literally stopped what he was doing to dance" style="position: absolute; left: 60%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
        <div class="timeline-marker" data-time="10" data-comment-id="6" data-username="@BeatDropper" data-full-text="This drop hits different at 2x speed 😤" style="position: absolute; left: 66.67%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
        <div class="timeline-marker" data-time="13" data-comment-id="7" data-username="@MemeMaster" data-full-text="POV: It's 2008 and you're spending your allowance on Wii Points 🥲" style="position: absolute; left: 86.67%; top: -6px; width: 4px; height: 15px; background: #ffeb3b; cursor: pointer;"></div>
      </div>
      
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="play-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button style="background: none; border: none; color: white; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l10 8L6 20V4z M18 4v16h2V4h-2z"/>
            </svg>
          </button>
          <button style="background: none; border: none; color: white; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <span class="time-display" style="color: white; font-size: 12px; margin-left: 8px;">0:05 / 0:15</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="loop-btn" style="background: none; border: none; color: #ff0000; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;" title="Loop">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </button>
          <button style="background: none; border: none; color: white; cursor: pointer; padding: 4px 8px; font-size: 13px; font-weight: 400;">CC</button>
          <button class="settings-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 0; position: relative; display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            <div class="settings-menu" style="position: absolute; bottom: 30px; right: 0; background: rgba(28,28,28,0.98); border-radius: 8px; padding: 8px 0; min-width: 260px; display: none; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
              <div style="color: #aaa; font-size: 11px; padding: 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">Settings</div>
              <div class="menu-item community-toggle" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; cursor: pointer; background: rgba(255,235,59,0.1);">
                <span style="color: #ffeb3b; font-size: 14px;">Community Commentary</span>
                <div class="toggle active" style="width: 36px; height: 20px; background: #ffeb3b; border-radius: 10px; position: relative; transition: background 0.2s;">
                  <div style="width: 16px; height: 16px; background: #212121; border-radius: 50%; position: absolute; top: 2px; right: 2px; transition: all 0.2s;"></div>
                </div>
              </div>
              <div class="menu-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; cursor: pointer;">
                <span style="color: white; font-size: 14px;">Playback speed</span>
                <span style="color: #aaa; font-size: 14px;">Normal ›</span>
              </div>
              <div class="menu-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; cursor: pointer;">
                <span style="color: white; font-size: 14px;">Quality</span>
                <span style="color: #aaa; font-size: 14px;">Auto ›</span>
              </div>
            </div>
          </button>
          <button style="background: none; border: none; color: white; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="video-info-section" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
    <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">crumb cat dancing to wii shop music (15 second loop)</h3>
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
        <span>847K views</span>
        <span>•</span>
        <span>3 months ago</span>
      </div>
      <button class="toggle-comments" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <span>Comments</span>
      </button>
    </div>
  </div>
  
  <!-- Comments Section -->
  <div class="comments-section" style="display: none; border-top: 1px solid rgba(255,255,255,0.1); padding: 16px; max-height: 210px; overflow-y: auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h4 style="margin: 0; font-size: 16px;">Comments</h4>
      <select class="comment-sort" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; outline: none;">
        <option value="newest">Newest</option>
        <option value="timecode">By timecode</option>
      </select>
    </div>
    
    <!-- Comment Input -->
    <div class="comment-input-box" style="border-radius: 8px; padding: 12px; margin-bottom: 16px;">
      <textarea class="comment-input" placeholder="Add a comment..." style="width: 100%; background: transparent; border: none; resize: none; font-family: inherit; font-size: 14px; line-height: 1.4; outline: none; overflow: hidden; transition: height 0.2s ease;" rows="1"></textarea>
      <div class="comment-actions" style="display: none; justify-content: space-between; align-items: center; margin-top: 8px;">
        <span class="comment-timecode" style="font-size: 12px;">@ 0:00</span>
        <div style="display: flex; gap: 8px;">
          <button class="comment-cancel" style="background: transparent; color: #909090; border: none; padding: 6px 16px; border-radius: 4px; font-size: 14px; cursor: pointer;">Cancel</button>
          <button class="comment-submit" style="background: #065fd4; color: white; border: none; padding: 6px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; opacity: 0.5;" disabled>Comment</button>
        </div>
      </div>
    </div>
    
    <!-- Comments List -->
    <div class="comments-list">
      <div class="comment-item" data-comment-id="1" data-time="2" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #ff9800; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">T</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@TomNook</span>
              <a href="#" class="comment-time-link" data-time="2" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:02</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">Already vibing 🎶</p>
          </div>
        </div>
      </div>
      
      <div class="comment-item" data-comment-id="2" data-time="4" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #ff6b6b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">C</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@CatLover2024</span>
              <a href="#" class="comment-time-link" data-time="4" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:04</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">The way crumb bobs to the beat here is EVERYTHING 😸</p>
          </div>
        </div>
      </div>
      
      <div class="comment-item" data-comment-id="3" data-time="6" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #2196f3; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">N</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@NostalgicGamer</span>
              <a href="#" class="comment-time-link" data-time="6" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:06</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">This takes me back to Saturday afternoons</p>
          </div>
        </div>
      </div>
      
      <div class="comment-item" data-comment-id="4" data-time="8" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #e91e63; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">V</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@VirtuallyVibe</span>
              <a href="#" class="comment-time-link" data-time="8" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:08</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">HERE COMES THE BEST PART!! 🔥🔥🔥</p>
          </div>
        </div>
      </div>
      
      <div class="comment-item" data-comment-id="5" data-time="9" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #00bcd4; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">D</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@DanceCat</span>
              <a href="#" class="comment-time-link" data-time="9" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:09</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">My cat literally stopped what he was doing to dance</p>
          </div>
        </div>
      </div>
      
      <div class="comment-item" data-comment-id="6" data-time="10" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #795548; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">B</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@BeatDropper</span>
              <a href="#" class="comment-time-link" data-time="10" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:10</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">This drop hits different at 2x speed 😤</p>
          </div>
        </div>
      </div>
      
      <div class="comment-item" data-comment-id="7" data-time="13" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: #4ecdc4; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">M</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@MemeMaster</span>
              <a href="#" class="comment-time-link" data-time="13" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">0:13</a>
            </div>
            <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">POV: It's 2008 and you're spending your allowance on Wii Points 🥲</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</div>
</div><!-- End of titanium wrapper -->


<style>
/* Default cursor for the prototype (non-interactive areas) */
.youtube-demo {
  cursor: url('data:image/svg+xml;utf8,%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M4.89415 6.3844C4.57502 5.5334 5.46478 4.73239 6.27769 5.13885L17.5821 10.7911C18.4125 11.2063 18.2781 12.4305 17.3775 12.6556L12.5326 13.8669C12.2009 13.9498 11.9345 14.1964 11.8264 14.5208L10.8932 17.3203C10.5952 18.2144 9.3391 18.2376 9.00821 17.3552L4.89415 6.3844Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/%3E%3C/svg%3E') 4 4, default;
}

/* Apply default cursor to all elements within the prototype */
.youtube-demo * {
  cursor: inherit !important;
}

/* Clickable elements get the interactive cursor with blue dot */
.youtube-demo button,
.youtube-demo a,
.youtube-demo .timeline-marker,
.youtube-demo .play-btn,
.youtube-demo .loop-btn,
.youtube-demo .settings-btn,
.youtube-demo .action-button,
.youtube-demo .toggle-comments,
.youtube-demo .comment-time-link,
.youtube-demo .menu-item,
.youtube-demo [role="button"],
.youtube-demo [onclick],
.youtube-demo input[type="submit"],
.youtube-demo input[type="button"],
.youtube-demo .clickable {
  cursor: url('data:image/svg+xml;utf8,%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M4.89415 6.3844C4.57502 5.5334 5.46478 4.73239 6.27769 5.13885L17.5821 10.7911C18.4125 11.2063 18.2781 12.4305 17.3775 12.6556L12.5326 13.8669C12.2009 13.9498 11.9345 14.1964 11.8264 14.5208L10.8932 17.3203C10.5952 18.2144 9.3391 18.2376 9.00821 17.3552L4.89415 6.3844Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/%3E%3Cpath d="M18 8.5C19.3807 8.5 20.5 7.38071 20.5 6C20.5 4.61929 19.3807 3.5 18 3.5C16.6193 3.5 15.5 4.61929 15.5 6C15.5 7.38071 16.6193 8.5 18 8.5Z" fill="%23007AFF" stroke="white"/%3E%3Cpath d="M16 8L14 10" stroke="%23007AFF" stroke-width="1.5" stroke-linecap="round"/%3E%3C/svg%3E') 4 4, pointer !important;
}

/* Text selection areas get text cursor */
.youtube-demo input[type="text"],
.youtube-demo textarea,
.youtube-demo [contenteditable="true"],
.youtube-demo .comment-input {
  cursor: text !important;
}

/* Draggable elements get grab cursor */
.youtube-demo .progress-bar,
.youtube-demo .progress-fill {
  cursor: url('data:image/svg+xml;utf8,%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M12 8C10.5825 8 10.1696 9.00466 10.0494 9.58987C9.99603 9.84966 9.89464 10.1054 9.70711 10.2929L7.70711 12.2929C7.31658 12.6834 7.31658 13.3166 7.70711 13.7071L9.70711 15.7071C9.89464 15.8946 9.99603 16.1503 10.0494 16.4101C10.1696 16.9953 10.5825 18 12 18C13.4175 18 13.8304 16.9953 13.9506 16.4101C14.004 16.1503 14.1054 15.8946 14.2929 15.7071L16.2929 13.7071C16.6834 13.3166 16.6834 12.6834 16.2929 12.2929L14.2929 10.2929C14.1054 10.1054 14.004 9.84966 13.9506 9.58987C13.8304 9.00466 13.4175 8 12 8Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/%3E%3Cpath d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z" fill="%23007AFF"/%3E%3C/svg%3E') 12 12, grab !important;
}

/* Disabled elements get not-allowed cursor */
.youtube-demo button:disabled,
.youtube-demo [disabled],
.youtube-demo .disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}

/* Light mode styles (default) */
.linear-prototype-wrapper {
  background: #fafafa;
  border: 1px solid #e5e7eb;
}

.linear-prototype-wrapper .prototype-label {
  color: #374151;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .linear-prototype-wrapper {
    background: #1a1a1a;
    border-color: #292929;
  }
  
  .linear-prototype-wrapper .prototype-label {
    color: #d1d5db;
  }
  
  .live-demo-badge > div {
    background: #2a2a2a !important;
    border-color: #404040 !important;
  }
  
  .live-demo-badge span {
    color: #d1d5db !important;
  }
  
  .prototype-toggle {
    background: #374151 !important;
    color: #d1d5db !important;
  }
  
  .prototype-toggle:hover {
    background: #2d3748 !important;
  }
  
  .prototype-toggle:active {
    background: #1f2937 !important;
  }
}

/* Toggle button styles */
.prototype-toggle {
  transition: all 0.2s ease;
}

.prototype-toggle:hover {
  background: #d1d5db !important;
}

/* Dark mode override for toggle button */
@media (prefers-color-scheme: dark) {
  .prototype-toggle:hover {
    background: #2d3748 !important;
  }
}

.prototype-toggle:active {
  background: #9ca3af !important;
}

.linear-prototype-wrapper.collapsed .youtube-demo {
  display: none;
}

.linear-prototype-wrapper.collapsed {
  padding-bottom: 15px !important;
}

/* Light mode styles (default) */
.youtube-demo .video-info-section,
.youtube-demo .comments-section {
  background: white;
  color: black;
}

.youtube-demo .video-info-section h3,
.youtube-demo .comments-section h4 {
  color: black;
}

.youtube-demo .video-info-section > div > div {
  color: #606060;
}

.youtube-demo .toggle-comments {
  color: black;
}

.youtube-demo .comments-section .comment-item p,
.youtube-demo .comments-section .comment-item span {
  color: black !important;
}

.youtube-demo .comments-section .comment-input-box {
  background: rgba(0,0,0,0.05) !important;
}

.youtube-demo .comments-section .comment-input {
  color: black !important;
}

.youtube-demo .comments-section .comment-timecode {
  color: #606060 !important;
}

.youtube-demo .comment-sort {
  color: black;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .youtube-demo .video-info-section,
  .youtube-demo .comments-section {
    background: rgb(15, 15, 15);
    color: white;
  }
  
  .youtube-demo .video-info-section h3,
  .youtube-demo .comments-section h4 {
    color: #f1f1f1;
  }
  
  .youtube-demo .video-info-section > div > div {
    color: #aaa;
  }
  
  .youtube-demo .toggle-comments {
    color: #f1f1f1;
  }
  
  .youtube-demo .comments-section .comment-item p,
  .youtube-demo .comments-section .comment-item span {
    color: #f1f1f1 !important;
  }
  
  .youtube-demo .comments-section .comment-input-box {
    background: rgba(255,255,255,0.05) !important;
  }
  
  .youtube-demo .comments-section .comment-input {
    color: #f1f1f1 !important;
  }
  
  .youtube-demo .comments-section .comment-timecode {
    color: #aaa !important;
  }
  
  .youtube-demo .comment-sort {
    color: #f1f1f1;
    background: rgb(15, 15, 15) !important;
    border-color: rgba(255,255,255,0.2) !important;
  }
  
  .youtube-demo .comment-sort option {
    background: rgb(15, 15, 15);
  }
}

/* YouTube-style controls fade */
.youtube-demo .controls-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  padding: 48px 12px 8px;
  transition: opacity 0.3s ease;
  opacity: 0;
  z-index: 10;
}

.youtube-demo:hover .controls-wrapper,
.youtube-demo.controls-visible .controls-wrapper {
  opacity: 1;
}

/* Ensure image has no hover effects */
.youtube-demo img {
  transform: none !important;
  transition: none !important;
}

/* Clean button styles */
.youtube-demo button {
  transition: opacity 0.15s ease;
  outline: none;
  box-shadow: none !important;
  border: none !important;
}

.youtube-demo button:hover {
  opacity: 0.8;
}

.youtube-demo button:focus {
  outline: none;
}

.youtube-demo .menu-item:hover {
  background: rgba(255,255,255,0.1);
}

.youtube-demo .progress-bar:hover .progress-fill::after {
  width: 16px !important;
  height: 16px !important;
  right: -8px !important;
}

/* Timeline marker hover effects */
.youtube-demo .timeline-marker {
  transform-origin: center bottom;
  transition: all 0.2s ease;
  /* Ensure consistent positioning */
  top: -6px !important;
  height: 15px !important;
  width: 4px !important;
  vertical-align: baseline;
}

.youtube-demo .timeline-marker:hover {
  transform: scale(1.2) translateY(0);
  box-shadow: 0 0 8px rgba(255,235,59,0.6);
}

/* Removed hover requirement - comments show via JavaScript */

.youtube-demo .timeline-tooltip {
  transition: all 0.2s ease;
  z-index: 1000;
}

/* SoundCloud-style comment component */
.sc-comment {
  position: absolute;
  background: rgba(255,255,255,0.98);
  color: #333;
  padding: 8px 10px;
  border-radius: 3px;
  font-size: 12px;
  max-width: 280px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  white-space: normal;
  line-height: 1.4;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

/* Glassomorphic iOS 16 tooltip style */
.timeline-tooltip-minimal {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 25; /* Above everything */
  flex-shrink: 0;
  margin: 0 8px;
}


.timeline-tooltip-minimal .tooltip-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.timeline-tooltip-minimal .tooltip-comment {
  background: rgba(20, 20, 22, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: rgba(255, 255, 255, 0.95);
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 
              0 2px 8px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.timeline-tooltip-minimal:hover .tooltip-comment {
  background: rgba(25, 25, 27, 0.85);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 
              0 4px 12px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Comment section styles */
.comment-item {
  transition: background 0.3s ease;
}

.comment-item.highlighted {
  background: rgba(255,235,59,0.1) !important;
  animation: highlightPulse 2s ease;
}

@keyframes highlightPulse {
  0% { background: rgba(255,235,59,0.2); }
  50% { background: rgba(255,235,59,0.1); }
  100% { background: rgba(255,235,59,0.1); }
}

.comment-time-link {
  background: rgba(62, 166, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.comment-time-link:hover {
  background: rgba(62, 166, 255, 0.2);
  text-decoration: none !important;
}

/* Countdown circle overlay */
.countdown-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 9999;
  pointer-events: none;
}

.countdown-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.countdown-circle circle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 4;
}

.countdown-circle .progress {
  stroke: #ff0000;
  stroke-dasharray: 251.2;
  stroke-dashoffset: 251.2;
  animation: countdown 3s linear forwards;
}

@keyframes countdown {
  to {
    stroke-dashoffset: 0;
  }
}

/* Position tooltips close to timeline */
.youtube-demo .timeline-marker .timeline-tooltip {
  bottom: 25px !important;
}

.sc-comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.sc-comment-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.sc-comment-username {
  font-size: 11px;
  color: #999;
  font-weight: 500;
}

.sc-comment-time {
  font-size: 11px;
  color: #999;
  margin-left: auto;
}

.sc-comment-text {
  color: #333;
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
}

.sc-comment-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(255,255,255,0.98);
}

/* Modern pulse animation */
@keyframes modernPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.2;
  }
}

/* Comments section transitions */
.comments-section {
  transition: all 0.2s ease;
  transform-origin: top;
  overflow: hidden;
  position: relative;
  contain: layout style;
}

.comments-section.expanding {
  animation: expandSection 0.2s ease forwards;
}

.comments-section.collapsing {
  animation: collapseSection 0.15s ease forwards;
}

@keyframes expandSection {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 210px;
  }
}

@keyframes collapseSection {
  from {
    opacity: 1;
    max-height: 210px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}

/* Live demo indicator animations */
@keyframes pillPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0,255,136,0.1);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(0,255,136,0.05);
  }
}

@keyframes ledGlow {
  0% {
    box-shadow: 0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.4), inset 0 1px 1px rgba(255,255,255,0.3);
  }
  100% {
    box-shadow: 0 0 12px #00ff88, 0 0 24px rgba(0,255,136,0.6), inset 0 1px 1px rgba(255,255,255,0.5);
  }
}

@keyframes pulseRing {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const demo = document.querySelector('.youtube-demo');
  if (!demo) return; // Exit if demo not found
  
  // Store GIF state
  const gifImg = demo.querySelector('.video-gif');
  const gifSrc = gifImg ? gifImg.src : null;
  let gifPaused = false;
  
  const playBtn = demo.querySelector('.play-btn');
  const progressBar = demo.querySelector('.progress-bar');
  const progressFill = demo.querySelector('.progress-fill');
  const timeDisplay = demo.querySelector('.time-display');
  const settingsBtn = demo.querySelector('.settings-btn');
  const settingsMenu = demo.querySelector('.settings-menu');
  const communityToggle = demo.querySelector('.community-toggle');
  const comments = demo.querySelectorAll('.comment');
  const timelineMarkers = demo.querySelectorAll('.timeline-marker');
  const commentsSection = demo.querySelector('.comments-section');
  const commentInput = demo.querySelector('.comment-input');
  const commentTimecode = demo.querySelector('.comment-timecode');
  const commentSubmit = demo.querySelector('.comment-submit');
  const commentCancel = demo.querySelector('.comment-cancel');
  const commentActions = demo.querySelector('.comment-actions');
  const commentsList = demo.querySelector('.comments-list');
  const toggleCommentsBtn = demo.querySelector('.toggle-comments');
  const loopBtn = demo.querySelector('.loop-btn');
  const tooltipContainer = demo.querySelector('.tooltip-container');
  const commentSort = demo.querySelector('.comment-sort');
  
  let playing = false;
  let currentTime = 5; // Start at 0:05
  let duration = 15; // 0:15 total
  let playInterval = null;
  let loopEnabled = true; // Enabled by default like YouTube Premium
  let commentTimeouts = new Map();
  let communityEnabled = true;
  
  // Create a unique demo instance object attached to the demo element
  demo.youtubeDemo = {
    get playing() { return playing; },
    get currentTime() { return currentTime; },
    set currentTime(val) { currentTime = val; updateTime(); },
    showControls: showControls,
    resetCommunity: () => { communityEnabled = true; },
    hideAllComments: hideAllComments
  };
  
  // Format time
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Update time display
  function updateTime() {
    timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    const progress = (currentTime / duration) * 100;
    progressFill.style.width = progress + '%';
  }
  
  // Show comment with stacking logic
  function showComment(comment) {
    if (!communityEnabled) return;
    
    const commentTime = parseInt(comment.dataset.time);
    
    // Find other comments that should be visible at the same time (within 5 seconds)
    const nearbyComments = Array.from(comments).filter(c => {
      const cTime = parseInt(c.dataset.time);
      return Math.abs(cTime - commentTime) <= 5 && c.style.opacity !== '1';
    });
    
    // Hide all other comments that aren't nearby
    comments.forEach(c => {
      const cTime = parseInt(c.dataset.time);
      if (Math.abs(cTime - commentTime) > 5) {
        c.style.opacity = '0';
        c.style.bottom = '80px'; // Reset to baseline
        clearTimeout(commentTimeouts.get(c));
      }
    });
    
    // Show up to 3 nearby comments with stacking
    const visibleComments = nearbyComments.slice(0, 3);
    visibleComments.forEach((c, index) => {
      // Apply vertical stacking by adjusting bottom position
      const baseBottom = 80; // Base position in pixels
      const stackOffset = index * 40; // 40px vertical offset for each stacked comment
      
      c.style.bottom = `${baseBottom + stackOffset}px`;
      
      // Add subtle opacity and scale variation for depth
      c.style.opacity = index === 0 ? '1' : (index === 1 ? '0.9' : '0.8');
      c.style.transform = `translateX(-50%) scale(${1 - index * 0.05})`;
      c.style.zIndex = 100 - index;
      
      // Auto-hide after 7 seconds
      const timeout = setTimeout(() => {
        c.style.opacity = '0';
        // Reset position
        c.style.bottom = '80px';
        c.style.transform = 'translateX(-50%)';
        c.style.zIndex = '';
      }, 7000);
      
      commentTimeouts.set(c, timeout);
    });
  }
  
  // Hide all comments/tooltips
  function hideAllComments() {
    // Hide all tooltips in the container
    const tooltips = tooltipContainer.querySelectorAll('.timeline-tooltip-minimal');
    tooltips.forEach(tooltip => {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
      clearTimeout(commentTimeouts.get(tooltip));
    });
    
    commentTimeouts.clear();
  }
  
  // Create tooltip for marker
  function createTooltip(marker) {
    const tooltip = document.createElement('div');
    tooltip.className = 'timeline-tooltip-minimal';
    tooltip.dataset.markerId = marker.dataset.time;
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.className = 'tooltip-avatar';
    const username = marker.dataset.username || '@User';
    const initial = username.charAt(1) || username.charAt(0); // Skip @ if present
    avatar.textContent = initial.toUpperCase();
    
    // Generate avatar color based on username
    const colors = ['#ff9800', '#ff6b6b', '#2196f3', '#e91e63', '#00bcd4', '#795548', '#4ecdc4'];
    const colorIndex = username.charCodeAt(1) % colors.length;
    avatar.style.background = colors[colorIndex];
    
    // Create comment pill
    const comment = document.createElement('div');
    comment.className = 'tooltip-comment';
    comment.textContent = marker.dataset.fullText || '';
    
    tooltip.appendChild(avatar);
    tooltip.appendChild(comment);
    tooltipContainer.appendChild(tooltip);
    return tooltip;
  }
  
  // Position tooltip relative to marker
  function positionTooltip(tooltip, marker) {
    const demoRect = demo.getBoundingClientRect();
    const videoSection = demo.querySelector('div[style*="padding-bottom: 56.25%"]');
    const videoRect = videoSection.getBoundingClientRect();
    const controlsVisible = demo.classList.contains('controls-visible');
    const controlsWrapper = demo.querySelector('.controls-wrapper');
    
    // Ensure tooltip is in container
    if (tooltip.parentElement !== tooltipContainer) {
      tooltipContainer.appendChild(tooltip);
    }
    
    // Reset positioning
    tooltip.style.position = 'absolute';
    
    if (controlsVisible && marker) {
      // When controls visible, position above the timeline marker
      const markerRect = marker.getBoundingClientRect();
      const progressBar = demo.querySelector('.progress-bar');
      const progressBarRect = progressBar.getBoundingClientRect();
      const containerRect = tooltipContainer.getBoundingClientRect();
      
      // Get tooltip dimensions
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'flex';
      const tooltipRect = tooltip.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      tooltip.style.visibility = '';
      
      // Calculate position relative to container
      const markerLeft = markerRect.left - containerRect.left + markerRect.width / 2;
      const progressTop = progressBarRect.top - containerRect.top;
      
      // Calculate horizontal position with bounds checking
      let leftPos = markerLeft;
      const minLeft = tooltipWidth/2 + 10;
      const maxLeft = containerRect.width - tooltipWidth/2 - 10;
      
      if (leftPos < minLeft) {
        leftPos = minLeft;
      } else if (leftPos > maxLeft) {
        leftPos = maxLeft;
      }
      
      // Position above progress bar
      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = (progressTop - tooltipHeight - 20) + 'px';
      tooltip.style.transform = 'translateX(-50%)';
    } else {
      // When controls hidden, position at bottom of video (3px from bottom)
      const containerRect = tooltipContainer.getBoundingClientRect();
      const videoGif = demo.querySelector('.video-gif');
      const videoRect = videoGif.getBoundingClientRect();
      
      // Calculate position relative to container
      const centerX = containerRect.width / 2;
      const bottomY = (videoRect.bottom - containerRect.top) - 3; // 3px from bottom of video
      
      // Get tooltip height for proper positioning
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'flex';
      const tooltipHeight = tooltip.getBoundingClientRect().height;
      tooltip.style.visibility = '';
      
      tooltip.style.left = centerX + 'px';
      tooltip.style.top = (bottomY - tooltipHeight) + 'px';
      tooltip.style.transform = 'translateX(-50%)';
    }
  }
  
  // Open comments section and highlight specific comment
  function openCommentsAndHighlight(commentId) {
    // Show comments section
    commentsSection.style.display = 'block';
    
    // Remove existing highlights
    document.querySelectorAll('.comment-item').forEach(item => {
      item.classList.remove('highlighted');
    });
    
    // Find and highlight the specific comment
    const targetComment = commentsSection.querySelector(`[data-comment-id="${commentId}"]`);
    if (targetComment) {
      targetComment.classList.add('highlighted');
      // Scroll to comment
      // Scroll within the comments section only
      const commentsContainer = targetComment.closest('.comments-section');
      if (commentsContainer) {
        const containerRect = commentsContainer.getBoundingClientRect();
        const targetRect = targetComment.getBoundingClientRect();
        const scrollTop = targetRect.top - containerRect.top + commentsContainer.scrollTop - (containerRect.height / 2) + (targetRect.height / 2);
        commentsContainer.scrollTop = scrollTop;
      }
    }
  }
  
  // Check for comments at current time
  function checkComments() {
    if (!communityEnabled) return;
    
    // Show comments near current time
    timelineMarkers.forEach(marker => {
      const markerTime = parseInt(marker.dataset.time);
      const timeDiff = currentTime - markerTime;
      
      // Only show if we just passed this time (within 0.2 seconds)
      if (timeDiff >= 0 && timeDiff < 0.2) {
        // Hide all other comments first
        hideAllComments();
        
        // Get or create tooltip for this marker
        let tooltip = tooltipContainer.querySelector(`[data-marker-id="${marker.dataset.time}"]`);
        if (!tooltip) {
          tooltip = createTooltip(marker);
        }
        
        // Position and show tooltip
        positionTooltip(tooltip, marker);
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';
        
        // Auto-hide after 3 seconds
        const timeout = setTimeout(() => {
          tooltip.style.opacity = '0';
          tooltip.style.pointerEvents = 'none';
        }, 3000);
        
        commentTimeouts.set(tooltip, timeout);
      }
    });
  }
  
  // Timeline marker click handlers
  timelineMarkers.forEach(marker => {
    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      const time = parseInt(marker.dataset.time);
      currentTime = time;
      updateTime();
      
      if (communityEnabled) {
        // Hide all other tooltips
        hideAllComments();
        
        // Get or create tooltip for this marker
        let tooltip = tooltipContainer.querySelector(`[data-marker-id="${marker.dataset.time}"]`);
        if (!tooltip) {
          tooltip = createTooltip(marker);
        }
        
        // Position and show tooltip
        positionTooltip(tooltip, marker);
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';
        
        // Auto-hide after 3 seconds
        const timeout = setTimeout(() => {
          tooltip.style.opacity = '0';
          tooltip.style.pointerEvents = 'none';
        }, 3000);
        
        commentTimeouts.set(tooltip, timeout);
      }
    });
  });
  
  // Add click handler to tooltips (use event delegation)
  tooltipContainer.addEventListener('click', (e) => {
    const tooltip = e.target.closest('.timeline-tooltip-minimal');
    if (tooltip) {
      e.stopPropagation();
      const markerId = tooltip.dataset.markerId;
      const marker = demo.querySelector(`.timeline-marker[data-time="${markerId}"]`);
      if (marker && marker.dataset.commentId) {
        openCommentsAndHighlight(marker.dataset.commentId);
      }
    }
  });

  // Control visibility timeout
  let controlsTimeout = null;
  
  function showControls() {
    demo.classList.add('controls-visible');
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (playing) {
        demo.classList.remove('controls-visible');
      }
    }, 3000);
  }
  
  // Watch for controls visibility changes and reposition all visible tooltips
  const controlsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Reposition all visible tooltips
        const visibleTooltips = tooltipContainer.querySelectorAll('.timeline-tooltip-minimal[style*="opacity: 1"]');
        visibleTooltips.forEach(tooltip => {
          const markerId = tooltip.dataset.markerId;
          const marker = demo.querySelector(`.timeline-marker[data-time="${markerId}"]`);
          if (marker) {
            positionTooltip(tooltip, marker);
          }
        });
      }
    });
  });
  
  // Start observing the demo element for class changes
  controlsObserver.observe(demo, { 
    attributes: true, 
    attributeFilter: ['class'] 
  });
  
  // Show controls on mouse move
  demo.addEventListener('mousemove', () => {
    showControls();
  });
  
  // Click on video to play/pause
  const videoContainer = demo.querySelector('div[style*="padding-bottom: 56.25%"]');
  if (videoContainer) {
    videoContainer.addEventListener('click', (e) => {
      // Don't trigger if clicking on controls or other interactive elements
      if (e.target === videoContainer || e.target.classList.contains('video-gif')) {
        playBtn.click();
      }
    });
  }
  
  // Play/pause
  playBtn.addEventListener('click', () => {
    // If at the end of video, restart from beginning
    if (currentTime >= duration) {
      currentTime = 0;
      updateTime();
      hideAllComments();
    }
    
    playing = !playing;
    demo.dataset.playing = playing;
    
    if (playing) {
      // Change to pause icon
      playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>`;
      
      // Resume GIF
      if (gifImg && gifPaused) {
        gifImg.src = gifSrc;
        gifPaused = false;
      }
      
      // Hide controls after 3 seconds
      showControls();
      
      // Start playback with requestAnimationFrame
      let lastFrameTime = performance.now();
      
      function animate(currentFrameTime) {
        if (!playing) return;
        
        // Calculate time elapsed since last frame
        const deltaTime = (currentFrameTime - lastFrameTime) / 1000; // Convert to seconds
        lastFrameTime = currentFrameTime;
        
        if (currentTime < duration) {
          currentTime += deltaTime;
          updateTime();
          checkComments();
          
          // Continue animation
          playInterval = requestAnimationFrame(animate);
        } else {
          // End of video
          if (loopEnabled) {
            // Loop back to beginning
            currentTime = 0;
            updateTime();
            hideAllComments();
            
            // Show controls briefly on loop
            showControls();
            setTimeout(() => {
              if (playing) {
                demo.classList.remove('controls-visible');
              }
            }, 1500);
            
            // Continue animation loop
            playInterval = requestAnimationFrame(animate);
          } else {
            // Stop playback
            playing = false;
            playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>`;
            demo.classList.add('controls-visible');
            demo.dataset.playing = 'false';
            
            // Pause GIF at the end
            if (gifImg && !gifPaused) {
              const canvas = document.createElement('canvas');
              canvas.width = gifImg.naturalWidth || gifImg.width;
              canvas.height = gifImg.naturalHeight || gifImg.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(gifImg, 0, 0);
              gifImg.src = canvas.toDataURL();
              gifPaused = true;
            }
          }
        }
      }
      
      // Start the animation
      playInterval = requestAnimationFrame(animate);
    } else {
      // Change to play icon
      playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>`;
      cancelAnimationFrame(playInterval);
      demo.classList.add('controls-visible');
      
      // Pause GIF by replacing with static frame
      if (gifImg && !gifPaused) {
        // Create canvas to capture current frame
        const canvas = document.createElement('canvas');
        canvas.width = gifImg.naturalWidth || gifImg.width;
        canvas.height = gifImg.naturalHeight || gifImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(gifImg, 0, 0);
        gifImg.src = canvas.toDataURL();
        gifPaused = true;
      }
    }
  });
  
  // Progress bar seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    currentTime = duration * percentage;
    updateTime();
    
    // Check for comments at new position
    hideAllComments();
    setTimeout(checkComments, 100);
  });
  
  // Settings menu
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
  });
  
  // Close settings when clicking outside
  document.addEventListener('click', (e) => {
    if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsMenu.style.display = 'none';
    }
  });
  
  // Community Commentary toggle
  communityToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    communityEnabled = !communityEnabled;
    
    const toggle = communityToggle.querySelector('.toggle');
    const toggleBtn = toggle.querySelector('div');
    
    if (communityEnabled) {
      toggle.style.background = '#ffeb3b';
      toggleBtn.style.left = '';
      toggleBtn.style.right = '2px';
    } else {
      toggle.style.background = 'rgba(255,255,255,0.3)';
      toggleBtn.style.left = '2px';
      toggleBtn.style.right = '';
      hideAllComments();
    }
  });
  
  // Community Commentary is the only menu item now
  
  // Comment input handling
  if (commentInput) {
    // Focus handler - expand the comment box
    commentInput.addEventListener('focus', () => {
      commentInput.rows = 2;
      commentActions.style.display = 'flex';
      // Update timecode when focusing on input
      commentTimecode.textContent = `@ ${formatTime(currentTime)}`;
    });
    
    // Input handler
    commentInput.addEventListener('input', () => {
      const hasText = commentInput.value.trim().length > 0;
      commentSubmit.disabled = !hasText;
      commentSubmit.style.opacity = hasText ? '1' : '0.5';
      
      // Auto-resize based on content
      commentInput.style.height = 'auto';
      commentInput.style.height = commentInput.scrollHeight + 'px';
    });
    
    // Cancel button handler
    if (commentCancel) {
      commentCancel.addEventListener('click', () => {
        commentInput.value = '';
        commentInput.rows = 1;
        commentInput.style.height = 'auto';
        commentActions.style.display = 'none';
        commentSubmit.disabled = true;
        commentSubmit.style.opacity = '0.5';
        commentInput.blur();
      });
    }
  }
  
  // Submit comment
  if (commentSubmit) {
    commentSubmit.addEventListener('click', () => {
      const text = commentInput.value.trim();
      if (text) {
        // Add new comment to the list
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.dataset.time = Math.floor(currentTime);
        newComment.style.cssText = 'padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);';
        
        newComment.innerHTML = `
          <div style="display: flex; gap: 12px;">
            <div style="width: 36px; height: 36px; background: #673ab7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: white; flex-shrink: 0;">Y</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="color: #f1f1f1; font-size: 13px; font-weight: 500;">@You</span>
                <a href="#" class="comment-time-link" data-time="${Math.floor(currentTime)}" style="color: #3ea6ff; font-size: 12px; text-decoration: none;">${formatTime(currentTime)}</a>
              </div>
              <p style="color: #f1f1f1; font-size: 14px; margin: 0; line-height: 1.4;">${text}</p>
            </div>
          </div>
        `;
        
        // Add to comments list
        commentsList.appendChild(newComment);
        
        // Clear and collapse input
        commentInput.value = '';
        commentInput.rows = 1;
        commentInput.style.height = 'auto';
        commentActions.style.display = 'none';
        commentSubmit.disabled = true;
        commentSubmit.style.opacity = '0.5';
        commentInput.blur();
        
        // Show comments section if hidden
        if (commentsSection.style.display === 'none') {
          commentsSection.style.display = 'block';
        }
        
        // Highlight new comment
        newComment.classList.add('highlighted');
        // Scroll within the comments section only
        const commentsContainer = newComment.closest('.comments-section');
        if (commentsContainer) {
          const containerRect = commentsContainer.getBoundingClientRect();
          const targetRect = newComment.getBoundingClientRect();
          const scrollTop = targetRect.top - containerRect.top + commentsContainer.scrollTop - (containerRect.height / 2) + (targetRect.height / 2);
          commentsContainer.scrollTop = scrollTop;
        }
      }
    });
  }
  
  // Sort comments function
  function sortComments(sortBy) {
    const commentsContainer = commentsList;
    const comments = Array.from(commentsContainer.querySelectorAll('.comment-item'));
    
    comments.sort((a, b) => {
      if (sortBy === 'newest') {
        // Reverse order for newest first (comment 7 first, comment 1 last)
        return parseInt(b.dataset.commentId) - parseInt(a.dataset.commentId);
      } else {
        // By timecode (ascending)
        return parseInt(a.dataset.time) - parseInt(b.dataset.time);
      }
    });
    
    // Clear and re-append in new order
    commentsContainer.innerHTML = '';
    comments.forEach(comment => commentsContainer.appendChild(comment));
  }
  
  // Comment sort dropdown handler
  if (commentSort) {
    commentSort.addEventListener('change', (e) => {
      sortComments(e.target.value);
    });
    
    // Sort by newest on load
    sortComments('newest');
  }
  
  // Update timecode display periodically
  setInterval(() => {
    if (commentInput && document.activeElement === commentInput) {
      commentTimecode.textContent = `@ ${formatTime(currentTime)}`;
    }
  }, 100);
  
  // Loop button
  if (loopBtn) {
    loopBtn.addEventListener('click', () => {
      loopEnabled = !loopEnabled;
      loopBtn.style.opacity = loopEnabled ? '1' : '0.7';
      loopBtn.style.color = loopEnabled ? '#ff0000' : 'rgba(255,255,255,0.7)';
    });
  }
  
  // Toggle comments button
  if (toggleCommentsBtn) {
    toggleCommentsBtn.addEventListener('click', () => {
      const isHidden = commentsSection.style.display === 'none';
      
      if (isHidden) {
        commentsSection.style.display = 'block';
        commentsSection.classList.remove('collapsing');
        commentsSection.classList.add('expanding');
        toggleCommentsBtn.style.background = 'rgba(255,255,255,0.1)';
      } else {
        commentsSection.classList.remove('expanding');
        commentsSection.classList.add('collapsing');
        setTimeout(() => {
          commentsSection.style.display = 'none';
        }, 150);
        toggleCommentsBtn.style.background = 'transparent';
      }
    });
  }
  
  // Set up click handler for comment time links - ISOLATED TO THIS DEMO
  demo.addEventListener('click', function(e) {
    if (e.target.classList.contains('comment-time-link')) {
      e.preventDefault();
      
      const time = parseInt(e.target.dataset.time);
      
      // Use the demo-specific youtubeDemo object
      if (demo.youtubeDemo) {
        // Set the time using the setter
        demo.youtubeDemo.currentTime = time;
        
        // Pause if playing  
        if (demo.youtubeDemo.playing && playBtn) {
          playBtn.click();
        }
        
        // Show controls
        if (demo.youtubeDemo.showControls) {
          demo.youtubeDemo.showControls();
        }
        
        // Check for timeline tooltips at this time
        setTimeout(() => {
          const markers = demo.querySelectorAll('.timeline-marker');
          markers.forEach(marker => {
            if (parseInt(marker.dataset.time) === time) {
              // Trigger mouseover to show tooltip
              const event = new MouseEvent('mouseover', {
                view: window,
                bubbles: true,
                cancelable: true
              });
              marker.dispatchEvent(event);
            }
          });
        }, 100);
      } else {
        // Fallback: Update UI directly if youtubeDemo not available
        const progress = (time / duration) * 100;
        progressFill.style.width = progress + '%';
        
        // Update time display
        timeDisplay.textContent = `${formatTime(time)} / ${formatTime(duration)}`;
        
        // Show controls
        demo.classList.add('controls-visible');
        
        // Pause if playing
        if (demo.dataset.playing === 'true' && playBtn) {
          playBtn.click();
        }
      }
      
      // Highlight the clicked comment - only within THIS demo
      const commentItem = e.target.closest('.comment-item');
      if (commentItem) {
        // Remove existing highlights only within this demo
        demo.querySelectorAll('.comment-item').forEach(item => {
          item.style.background = 'transparent';
        });
        // Add highlight to clicked comment
        commentItem.style.background = 'rgba(62, 166, 255, 0.1)';
        commentItem.style.borderRadius = '8px';
        commentItem.style.transition = 'background 0.3s ease';
      }
    }
  });
  
  // Initialize
  updateTime();
  demo.classList.add('controls-visible'); // Start with controls visible
  
  // Autoplay on load
  setTimeout(() => {
    playBtn.click();
  }, 500);
});

// Prototype toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const prototypeWrapper = document.querySelector('.linear-prototype-wrapper');
  const toggleBtn = document.querySelector('.prototype-toggle');
  const youtubeDemo = document.querySelector('.youtube-demo');
  
  if (toggleBtn && prototypeWrapper && youtubeDemo) {
    let isOn = true;
    let wasAutoToggled = false; // Track if it was auto-toggled by scroll
    
    function setToggleState(on, isAutomatic = false) {
      isOn = on;
      
      const greenLight = prototypeWrapper.querySelector('.live-demo-badge > div > div:first-child');
      const pulseRing = greenLight ? greenLight.querySelector('div') : null;
      
      if (isOn) {
        // Turn ON
        prototypeWrapper.classList.remove('collapsed');
        toggleBtn.textContent = 'OFF';
        toggleBtn.classList.remove('off');
        toggleBtn.style.background = '#e5e7eb';
        youtubeDemo.style.display = 'block';
        wasAutoToggled = false;
        
        // Turn green light back on
        if (greenLight) {
          greenLight.style.background = '#10b981';
          if (pulseRing) {
            pulseRing.style.background = '#10b981';
            pulseRing.style.animation = 'modernPulse 2s ease-in-out infinite';
          }
        }
        
        // Reset the demo to initial state
        const demo = youtubeDemo;
        if (demo && demo.youtubeDemo) {
          // Reset time to 5 seconds
          demo.youtubeDemo.currentTime = 5;
          
          // Ensure demo is paused
          const playBtn = demo.querySelector('.play-btn');
          if (demo.dataset.playing === 'true' && playBtn) {
            playBtn.click();
          }
          
          // Reset controls visibility
          demo.classList.add('controls-visible');
          
          // Re-enable community commentary
          demo.youtubeDemo.resetCommunity();
          const communityToggle = demo.querySelector('.community-toggle');
          if (communityToggle) {
            const toggle = communityToggle.querySelector('.toggle');
            const toggleBtn = toggle.querySelector('div');
            toggle.style.background = '#ffeb3b';
            toggleBtn.style.left = '';
            toggleBtn.style.right = '2px';
          }
          
          // Hide all tooltips and comments
          demo.youtubeDemo.hideAllComments();
          
          // Restart autoplay after a delay
          setTimeout(() => {
            if (playBtn && demo.dataset.playing !== 'true') {
              playBtn.click();
            }
          }, 500);
        }
      } else {
        // Turn OFF
        prototypeWrapper.classList.add('collapsed');
        toggleBtn.textContent = 'ON';
        toggleBtn.classList.add('off');
        toggleBtn.style.background = '#e5e7eb';
        youtubeDemo.style.display = 'none';
        
        // Turn green light off (grey)
        if (greenLight) {
          greenLight.style.background = '#9ca3af';
          if (pulseRing) {
            pulseRing.style.background = '#9ca3af';
            pulseRing.style.animation = 'none';
          }
        }
        
        // Pause the demo if it's playing
        const playBtn = youtubeDemo.querySelector('.play-btn');
        if (youtubeDemo.dataset.playing === 'true' && playBtn) {
          playBtn.click();
        }
        
        if (isAutomatic) {
          wasAutoToggled = true;
        }
      }
    }
    
    // Manual toggle
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      setToggleState(!isOn, false);
      wasAutoToggled = false; // Reset auto-toggle flag on manual interaction
    });
    
    // Set up Intersection Observer to auto-toggle based on visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is visible
          if (wasAutoToggled && !isOn) {
            // Auto-turn ON only if it was auto-turned OFF
            setToggleState(true, true);
          }
        } else {
          // Element is not visible
          if (isOn) {
            // Auto-turn OFF if currently ON
            setToggleState(false, true);
          }
        }
      });
    }, {
      // Trigger when 10% of the element is visible
      threshold: 0.1,
      // Add some margin so it triggers slightly before/after the element is fully out of view
      rootMargin: '50px'
    });
    
    // Start observing the prototype wrapper
    observer.observe(prototypeWrapper);
  }
});
</script>
{% endraw %}