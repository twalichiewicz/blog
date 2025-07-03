import React, { useEffect } from 'react';
import { DemoWrapper, DemoOnboarding, useDemoContext } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';
import ContentAuthoringTool from './components/ContentAuthoringTool';
import './App.css';

// Define onboarding steps with rich commentary
const onboardingSteps = [
  {
    title: "Welcome to LINO",
    description: "The Content Authoring Tool that transformed Autodesk's publishing from 3-4 weeks to just 2 hours. This interface democratized content creation across the organization.",
    developerNote: "The name LINO was chosen to evoke simplicity and approachability. We wanted something that felt like a friendly tool, not enterprise software.",
    businessImpact: "This single interface unlocked $6-8M in revenue by enabling rapid response to user needs.",
    metrics: [
      { value: "250x", label: "Faster Publishing" },
      { value: "$2M/yr", label: "Engineering Saved" }
    ]
  },
  {
    title: "Three-Column Workflow",
    description: "The interface is organized into three intuitive columns that guide content creators through the entire publishing process without technical knowledge.",
    developerNote: "We discovered that a left-to-right flow matched how content creators naturally think: trigger → content → distribution. This reduced cognitive load significantly.",
    highlight: true,
    highlightStyle: {
      top: "180px",
      left: "80px",
      right: "24px",
      height: "500px"
    },
    callouts: [
      {
        title: "Natural Language",
        description: "No code required",
        position: { top: "200px", left: "100px" }
      },
      {
        title: "Visual Preview",
        description: "WYSIWYG editing",
        position: { top: "200px", left: "50%", transform: "translateX(-50%)" }
      },
      {
        title: "Smart Defaults",
        description: "One-click publishing",
        position: { top: "200px", right: "100px" }
      }
    ]
  },
  {
    title: "Behavioral Targeting Made Simple",
    description: "Define complex user behaviors using simple dropdowns and wiki links. What used to require SQL queries now takes seconds.",
    developerNote: "The wiki URL validation was a game-changer. It forced documentation of logic while providing a reference point for QA. This reduced errors by 87%.",
    businessImpact: "Content creators could now target specific user segments without engineering help, enabling personalized guidance at scale.",
    highlight: true,
    highlightStyle: {
      top: "180px",
      left: "80px",
      width: "400px",
      height: "500px"
    }
  },
  {
    title: "Visual Content Editor",
    description: "See exactly how your content will appear to users. The preview updates in real-time as you type, eliminating guesswork.",
    developerNote: "We replicated the exact styling from the production app. This 1:1 fidelity meant no surprises after publishing. Content creators loved the confidence this gave them.",
    highlight: true,
    highlightStyle: {
      top: "180px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "400px",
      height: "500px"
    },
    callouts: [
      {
        title: "Media Upload",
        description: "Drag & drop images and videos",
        position: { top: "400px", left: "48%" }
      }
    ]
  },
  {
    title: "Smart Distribution Controls",
    description: "Control who sees your content and when. Advanced options are hidden by default but easily accessible when needed.",
    developerNote: "Progressive disclosure was key here. 80% of users never need advanced options, but power users can access version targeting, platform selection, and scheduling.",
    businessImpact: "Reduced mistargeted content by 94%, improving user satisfaction scores.",
    highlight: true,
    highlightStyle: {
      top: "180px",
      right: "24px",
      width: "400px",
      height: "500px"
    }
  },
  {
    title: "One-Click Publishing",
    description: "When you're ready, a single click triggers the entire publishing pipeline. What once required 8 people across 4 teams now happens automatically.",
    developerNote: "The 'Submit Request' button kicks off 17 different backend processes, but users just see a simple success animation. Complex systems should feel simple.",
    businessImpact: "Publishing time dropped from 3-4 weeks to 2 hours, with most of that being content review time.",
    metrics: [
      { value: "17", label: "Automated Steps" },
      { value: "8→1", label: "People Required" },
      { value: "95%", label: "Time Saved" },
      { value: "0", label: "Engineering Tickets" }
    ]
  }
];

function App() {
  const { isIframe } = useDemoContext();
  
  // Handle postMessage for demo reinitialization
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'reinitialize') {
        console.log('[Publishing Demo] Received reinitialize message:', event.data.reason)
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
      demoTitle="Self-Service Publishing Pipeline"
      demoDescription="Experience how we transformed content publishing at Autodesk"
    >
      <DemoWrapper 
        url="manage.autodesk.com/insights" 
        customCursor="interactive"
        className={isIframe ? 'demo-wrapper--iframe' : ''}
      >
        <ContentAuthoringTool />
      </DemoWrapper>
    </DemoOnboarding>
  );
}

export default App;