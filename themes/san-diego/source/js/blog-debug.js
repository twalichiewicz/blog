// Debug script to check what's happening with blog.js
console.log('[BlogDebug] Script loaded');

// Check if functions are available
setTimeout(() => {
    console.log('[BlogDebug] Checking available functions after 100ms:');
    console.log('- window.handleDynamicLinkClick:', typeof window.handleDynamicLinkClick);
    console.log('- window.fetchAndDisplayContent:', typeof window.fetchAndDisplayContent);
    console.log('- window.setupDynamicBlogNavigation:', typeof window.setupDynamicBlogNavigation);
    console.log('- window.initializeBlogFeatures:', typeof window.initializeBlogFeatures);
    console.log('- window.handleSearch:', typeof window.handleSearch);
    console.log('- window.initializePostsOnlyButton:', typeof window.initializePostsOnlyButton);
    console.log('- window.legacyTabSwitch:', typeof window.legacyTabSwitch);
    
    // Check if blog-content exists
    const blogContent = document.querySelector('.blog-content');
    console.log('[BlogDebug] .blog-content element:', blogContent);
    
    // Check for dynamic links
    const postLinks = document.querySelectorAll('a.post-link-wrapper');
    const projectLinks = document.querySelectorAll('a.portfolio-item-wrapper, a.portfolio-item.has-writeup');
    console.log('[BlogDebug] Post links found:', postLinks.length);
    console.log('[BlogDebug] Project links found:', projectLinks.length);
    
    // Check if handlers are attached
    if (postLinks.length > 0) {
        const firstLink = postLinks[0];
        // Note: Can't directly check if event listeners are attached, but we can log the element
        console.log('[BlogDebug] First post link:', firstLink.href);
    }
}, 100);

// Also check after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[BlogDebug] DOMContentLoaded fired');
    
    // Re-check everything
    console.log('[BlogDebug] Functions at DOMContentLoaded:');
    console.log('- window.handleDynamicLinkClick:', typeof window.handleDynamicLinkClick);
    console.log('- window.fetchAndDisplayContent:', typeof window.fetchAndDisplayContent);
    console.log('- window.setupDynamicBlogNavigation:', typeof window.setupDynamicBlogNavigation);
});

// Export a test function
window.blogDebugTest = () => {
    console.log('[BlogDebug] Manual test triggered');
    const links = document.querySelectorAll('a.post-link-wrapper');
    if (links.length > 0) {
        console.log('[BlogDebug] Simulating click on first post link');
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        links[0].dispatchEvent(event);
    }
};