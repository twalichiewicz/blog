---
title: Custom Install
has_writeup: false
company: Autodesk
byline: Led the design of an enterprise-scale cloud-based deployment solution
role: Lead Designer
date: 2019-08-30 20:52:01
categories:
  - [research]
  - [design]
  - [code]
cover_image: 2019/08/30/custom-install/customInstall-preview.png
fullscreen: true
tags:
  - portfolio
layout: project
---

<style>
  /* Increase project-header height to include nav (44px) */
  .project-header {
    position: relative;
    height: calc(120vh + 44px); /* 120vh plus the 44px nav */
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }

  /* Header content is limited to 100vh and pushed down by 44px so that it appears below the navigation */
  .header-content {
    position: relative;
    height: 100vh;
    width: 100%;
    margin-top: 44px;
  }

  /* Make sure the container with the project title sits above the boxes */
  .header-content .container {
    position: relative;
    z-index: 10;
    padding-top: 2rem; /* adjust as needed */
 top: 23%;
  }

  /* Container for the falling boxes */
  .parachute-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  /* Package (box emoji) animation style */
  .parachute-box {
    position: absolute;
    top: -50px;
    font-size: 60px;
    animation: parachute-fall 4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .parachute-box::before {
    content: "🪂";
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
    font-size: 40px;
  }

  /* Layer some boxes behind the title and some in front */
  .parachute-box:nth-child(odd) {
    z-index: 5;
  }
  
  .parachute-box:nth-child(even) {
    z-index: 15;
  }

  @keyframes parachute-fall {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(calc(100vh + 5vh)) translateX(-20px);
      opacity: 0;
    }
  }

  /* Scroll arrow positioned at the bottom of .header-content (100vh) */
  .scroll-arrow {
    position: absolute;
    bottom: 99px;
    left: 52%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .scroll-arrow .scroll-arrow-text {
  font-size: 36px;
    fill: currentColor;
    animation: bounce 2s infinite;
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  /* Remove border radii from all sections */
  section, .content-section, .project-content, .intro-section {
    border-radius: 0;
  }

  /* TLDR button near-black background using $_variables.scss's $black (hsl(0, 0%, 10%)) */
  .tldr-button {
    background-color: hsl(0, 0%, 10%);
    color: hsl(0, 0%, 100%);
    border: none;
    padding: 0.5rem 1rem;
  }
</style>

<div class="project-page">
  <header class="project-header">
    <div class="parachute-container">
      <div class="parachute-box">📦</div>
      <div class="parachute-box">📦</div>
      <div class="parachute-box">📦</div>
      <div class="parachute-box">📦</div>
    </div>
    <div class="header-content">
      <div class="container">
        <h1 class="project-title">Transforming Software Deployment at Enterprise Scale</h1>
      </div>
      <div class="scroll-arrow">
          <div class="scroll-arrow-text">↓</div>
      </div>
    </div>
  </header>
  
  <section class="intro-section">
    <div class="container">
      <p class="intro-text">For over 30 years, Autodesk has been a leader in design software. This is the story of how we transformed their fragmented installation systems into a unified, scalable platform.</p>
      <div class="button-group">
        <button class="tldr-button" onclick="document.body.classList.add('modal-open'); document.getElementById('tldrModal').classList.add('active')">TL;DR</button>
      </div>
    </div>
  </section>
  
  <div id="tldrModal" class="tldr-modal">
    <div class="modal-header">
      <button class="close-button" onclick="document.body.classList.remove('modal-open'); document.getElementById('tldrModal').classList.remove('active')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="modal-content">
      <p class="tldr-summary">Led the redesign of Autodesk's installation platform, transforming a complex desktop-based system into a streamlined web solution that handles over 30,000 installation packages.</p>
      <div class="key-points">
        <div class="point">
          <h3>The Challenge</h3>
          <p>Unify multiple siloed installation systems across 100+ Autodesk products into a single, efficient platform.</p>
        </div>
        <div class="point">
          <h3>The Solution</h3>
          <p>Created a web-based platform with standardized components that product teams could easily configure for their specific needs.</p>
        </div>
        <div class="point">
          <h3>The Impact</h3>
          <p>Reduced installation times by 60%, enabled 30,000+ package creations, and streamlined deployment for enterprise customers worldwide.</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="project-content">
    <div class="content-wrap">
      <div class="content-section">
        <h2>The Challenge: Uniting a Fractured System</h2>
        <div class="content-section__inner">
          <p>For over three decades, Autodesk has powered industries from architecture to manufacturing. But this leadership came with a challenge: the way Autodesk products were installed and deployed was fragmented, siloed, and outdated.</p>
          <p>Each of Autodesk's 100+ products had its own bespoke installer, often built and maintained independently by individual teams. While this decentralized approach allowed teams to meet niche needs, it created widespread inefficiencies and complexity for our enterprise customers.</p>
          <p>Unlike typical software installations, Autodesk products require precise version control and customization. Teams need specific versions of applications, plugins, and libraries to prevent file corruption and ensure compatibility across large organizations.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>The CAD Manager's Challenge</h2>
        <div class="content-section__inner">
          <p>As organizations grow, software installation becomes a controlled process managed by CAD/BIM managers. These specialists understand their team's needs and are responsible for ensuring everyone has the right tools, configured correctly.</p>
          <p>However, these managers faced significant challenges:</p>
          <div class="feature-grid">
            <div class="feature">
              <h3>Complex Deployments</h3>
              <p>Installation processes could take days, requiring careful sequencing of multiple installers.</p>
            </div>
            <div class="feature">
              <h3>Version Control</h3>
              <p>Managing multiple versions of applications for different projects.</p>
            </div>
            <div class="feature">
              <h3>Customization</h3>
              <p>Configuring applications to meet specific team needs and company standards.</p>
            </div>
            <div class="feature">
              <h3>Storage Overhead</h3>
              <p>Maintaining thousands of installer versions on corporate servers.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content-section">
        <h2>The Vision: A Unified Platform</h2>
        <div class="content-section__inner">
          <p>I was tasked with reimagining how Autodesk software is installed at scale. The vision was to create a centralized, web-based platform that could streamline deployment while empowering CAD managers to customize installations for their teams.</p>
          <div class="benefits-grid">
            <div class="benefit">
              <h3>Efficiency</h3>
              <p>Simplify the process of installing and managing software across large organizations.</p>
            </div>
            <div class="benefit">
              <h3>Scalability</h3>
              <p>Create a modular system adaptable to Autodesk's evolving product ecosystem.</p>
            </div>
            <div class="benefit">
              <h3>Empowerment</h3>
              <p>Reduce technical overhead for CAD managers, enabling focus on design and innovation.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- NEW SECTION: PARACHUTE METAPHOR -->
      <div class="content-section">
        <h2>Foreground: A Parachute Metaphor for Deployment</h2>
        <div class="content-section__inner">
          <p>
            Imagine a scenario where a remote team—like a group of engineers or designers—needs
            critical supplies to complete their work. For CAD managers (CALs), ensuring each team member
            has the exact tools, in the correct version, can feel just as urgent as delivering life-saving
            supplies to a remote outpost. That's where our supply drop analogy comes in: we're "airdropping"
            software packages so they safely reach each user without error or delay.
          </p>
          <h3>The Workflow: A Parachute for Every Need</h3>
          <p>
            Our deployment process can be broken down into four main stages. From "packing the parachutes"
            (configuring installers) to "dropping the supplies" (delivering them via SCCM), each step reflects
            the precision required in large-scale software management.
          </p>
          <h4>Stage 1: Configuration – Packing the Parachutes</h4>
          <ul>
            <li><strong>Metaphor</strong>: Carefully selecting and preparing resources (tools, settings, plugins)</li>
            <li><strong>What Happens</strong>: CALs pick which products and customizations belong in a single package.</li>
            <li><strong>Visual Cue</strong>: Imagine selecting fresh fruit for a care package—everything is meticulously
            labeled (e.g., "AutoCAD Plugins," "Revit Libraries") to ensure a safe "landing."</li>
          </ul>
          <h4>Stage 2: Packaging – Bundling for Deployment</h4>
          <ul>
            <li><strong>Metaphor</strong>: After packing parachutes, they're sealed into crates—our customized installers.</li>
            <li><strong>What Happens</strong>: All chosen customizations are combined into a single, cohesive installer
            ready for mass deployment.</li>
            <li><strong>Visual Cue</strong>: Boxes labeled with product names and versions, each sporting a little parachute icon.</li>
          </ul>
          <h4>Stage 3: Deployment – Dropping the Supplies</h4>
          <ul>
            <li><strong>Metaphor</strong>: SCCM (our "aircraft," nicknamed SCCMair) delivers these parachuted packages
            to target machines.</li>
            <li><strong>What Happens</strong>: Automated distribution ensures each package "lands" on the correct
            computer, while CALs monitor the status remotely.</li>
            <li><strong>Visual Cue</strong>: A plane silhouette releasing multiple parachuted boxes labeled
            "AutoCAD," "Revit," "3ds Max," etc.</li>
          </ul>
          <h4>Stage 4: Managed Environment – The Supplies in Action</h4>
          <ul>
            <li><strong>Metaphor</strong>: Once the packages land, they're opened by end users (like Javier),
            who immediately see everything set up and ready.</li>
            <li><strong>What Happens</strong>: The installation is preconfigured, letting the user focus on design
            tasks rather than manual setup.</li>
            <li><strong>Visual Cue</strong>: Javier opening a box and instantly accessing precisely the toolset
            he needs to keep projects moving.</li>
          </ul>
        </div>
      </div>
      <!-- END NEW SECTION -->
      <div class="content-section">
        <h2>Context</h2>
        <div class="content-section__inner">
          <p>Autodesk software has been available since the late 80's. Throughout that time, there have been many ways that installers were handled for each product, with product teams being responsible for coding and maintaining their own installers. Internally, this was known as the <strong>Install Framework</strong>.</p>
          <p>Unlike other software you may have in mind, Autodesk software is rarely ever installed in its vanilla state. Because of the large number of collaborators working on Autodesk files, there is an important need to ensure that everyone is using very specific versions of not only the overall application, but applets, plugins, and libraries to avoid any incompatibility (or corruption) of working files.</p>
          <p>To help companies plan for these issues, Autodesk products (and their installers) are architected in such a way as to support a high degree of customization for a specialist (most commonly referred to as a CAD manager) who understands the operations of the team better than anyone else.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Introducing CAL</h2>
        <div class="content-section__inner">
          <p>As teams working with Autodesk software get larger, there tends to be a natural progression where an individual contributor on the team who best understands the Autodesk software will take on the role of the "CAD / BIM manager". These individuals start to think about the tooling of a project at a more advanced level, and are typically responsible for testing software, making operational decisions, and ensuring that everyone is able to work with the team's files without blockages.</p>
          <p>And as the organization grows, software installation becomes more of a controlled process– end users (designers, engineers, etc.) have their installation privileges either restricted or removed, and rely on the tools they need to be installed for them, preconfigured correctly so they can focus entirely on their task at hand.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Installer Modification</h2>
        <div class="content-section__inner">
          <p>The methods by which one of these admins might customize their applications can vary greatly:</p>
          <div class="feature-grid">
            <div class="feature">
              <h3>Remove Functionality</h3>
              <p>Removing functionality in-application</p>
            </div>
            <div class="feature">
              <h3>Version Control</h3>
              <p>Restricting which version of an application can be used for a project</p>
              <p class="note">Sometimes there can even be multiple versions of the same application, with each particular version used for only a certain project</p>
            </div>
            <div class="feature">
              <h3>Pre-installation</h3>
              <p>Pre-installing libraries or plug-ins</p>
            </div>
            <div class="feature">
              <h3>UI Customization</h3>
              <p>Customizing the in-app UI to company standards</p>
            </div>
            <div class="feature">
              <h3>Localization</h3>
              <p>Localizing applications for international work</p>
            </div>
          </div>
          <p>Historically, this was done individually for each application, leading to lots (thousands, in some cases) of versions of installers, with an individual installer for each application. And when a CAL was doing a clean install on a machine, they would need to daisy-chain all of those installers (and make sure they happened in the correct order, because, yes, that can cause issues too), and wait the 10's of hours it could take to complete a single machine's full suite installation.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Siloing</h2>
        <div class="content-section__inner">
          <p>To add some more complexity to this problem, it's important to keep in mind how Autodesk has historically grown its products suites. Autodesk is well known for acquiring products and folding them into their own lineup, often maintaining the teams that worked on the product as-is, and simply incorporating platform specific Autodesk functionality (licensing, support, etc.) into the product.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Designing a platform</h2>
        <div class="content-section__inner">
          <p>So, now you, my reader, have the same context I was given when I started this project (my first project at Autodesk, mind you). And because I was learning about how all of these legacy systems worked as well as my unfamiliarity with Autodesk's product offerings, I decided that my method would be one of rapid iteration with very tight feedback loops from all relevant stakeholders. Because I couldn't trust my own background knowledge of the situation, I had to rely on what I heard from others, both internally and externally.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Web versus Desktop</h2>
        <div class="content-section__inner">
          <p>One of the first major decisions was where this new install experience should live. Historically, advanced installation configurations were done using the same installer application that came on a disk (or with later releases, was downloaded from the Autodesk Account portal).</p>
          <p>This was a necessity for a very long time because unlike other software, Autodesk applications are <em>large</em>, in the tens of gigabytes for even a standard installation. By utilizing a desktop installer, it also meant that all the necessary bits to create the installer package were already on disk, and were simply a matter of modifying or removing those bits in order to shape the software the way you wanted it. These large installer applications and component libraries were all typically stored on corporate servers in the workspace, so the speed of installer creation was only limited by amount of modification that needed to be done.</p>
          <div class="benefits-grid">
            <div class="benefit">
              <h3>Dynamic Creation</h3>
              <p>Because installers were dynamically created from the set of instructions from the web tool, it meant that administrators no longer needed to use up storage space on their own servers.</p>
            </div>
            <div class="benefit">
              <h3>Cloud Storage</h3>
              <p>With the ability for multiple to access the cloud-stored installer configurations, third party and external administrators were able to create packages for less experienced companies.</p>
            </div>
            <div class="benefit">
              <h3>Rapid Updates</h3>
              <p>Desktop installer applications were only updated with every yearly release cycle of Autodesk products. By removing the installer creation from the product release cycle, we were able to rapidly iterate and push out updates faster than the products themselves were updated.</p>
            </div>
            <div class="benefit">
              <h3>Remote Work</h3>
              <p>Because of the cross-platform nature of web applications, administrators were able to work remotely without having to be in the office <em>(which would come particularly in handy about three months into this project 🦠)</em>.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content-section">
        <h2>Looking for commonalities</h2>
        <div class="content-section__inner">
          <p>Until this project, product teams (Autodesk has around 100 individual products that they offer) were responsible for their own installer process, which meant that each team had over time built their own bespoke installation solution. Each installer followed its own paradigms, used its own codebase, and offered unique features for their end users to customize their application install.</p>
          <p>One of the first issues I knew I would need to handle would be to how to get these product teams to all align on the vision I was putting together. I needed to balance each team's unique needs, while also being strict about setting limitations on the amount of customization that would be available to them. I wanted our customers to be able to go to a single location, and see a familiar set of controls in order to customize any product.</p>
          <p>My starting approach was to basically look at each individual product's installers, and take notes on all of the fields that they had into one master spreadsheet. As I would do this, I would start to tag identical or very similar fields, and take note of what their purpose was. I would slowly start to organize the types of customizations into groupings and categories, and by the end I had a full list of every possible installer capability that was supported across all Autodesk products.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Standardizing customization</h2>
        <div class="content-section__inner">
          <p>Even with my newfound knowledge of all the potential ways that individual products could be customized, I knew that centralizing the maintenance of those customizations would not only be a large commitment of resources from our own team, but it would perpetually leave us having to back-and-forth with product teams, who might want to make necessary adjustments based off their own users's feedback or a new feature were were planning on releasing.</p>
          <div class="responsibilities-table">
            <h3>Team Responsibilities</h3>
            <table>
              <thead>
                <tr>
                  <th>Delivery team responsibilities</th>
                  <th>Product teams responsibilities</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Create and maintain .XML parser</td>
                  <td>Read our documentation and create an .XML file that tells us what their customization UI needs</td>
                </tr>
                <tr>
                  <td>Create a set of React components to show in the UI</td>
                  <td>QA and test that their customization UI is rendering properly</td>
                </tr>
                <tr>
                  <td>Ensure the output of a user's input was interpreted correctly</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="content-section">
        <h2>Validating design decisions</h2>
        <div class="content-section__inner">
          <p>One of the biggest concerns I had with this drastic of a shift was the potential impact it would have on the administrators at all of the different companies that rely on Autodesk software. Obviously getting the internal product teams to align was a challenge in of itself, but if the final product that we delivered was worse than what we already had we would have spent a lot of resources and reorganized a lot of historically "good enough" systems for no reason other than to change them.</p>
          <h3>Customer feedback council</h3>
          <p>From this need came the Autodesk Software Deployment Delta Team, a group of around 30 administrators from a variety of company sizes that were all experts in Autodesk product installations (CAL's, as referred to earlier). Along with my research and product management collaborators, we would have a recurring monthly meeting with all of these customers to discuss what we were working on, and hold a workshop to gather feedback, concerns, and to pulse check on what were the top-of-mind issues these users were currently working through.</p>
          <p>I made a point in each subsequent meeting to reiterate what feedback I had heard in the previous month's session, and described what steps or decisions had been made as a result of that feedback not only to keep the members of the council engaged, but to give ourselves an opportunity to improve our own interpretation skills of what our customers were trying to communicate to us.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>Beyond Release</h2>
        <div class="content-section__inner">
          <p>As anyone familiar with software development knows, there are always blue-sky features that aren't able to make the timeline originally agreed upon. While the released version of Custom Install was still very much a complete project, I feel it would be selling it short to not give a sense of what the full vision was, and what may eventually still be developed.</p>
          <h3>Remote Updating and Installation</h3>
          <p>While moving the tool to a web environment solved several of the shortcomings of the older desktop installer, one of the limitations of a web tool was that we lost our direct connection to seeing what is happening on any individual's machine.</p>
          <p>The Autodesk Desktop Application (ADA) is another application that Autodesk offered to help individual end-users keep their Autodesk software up-to-date. The proposed integration to the Custom Install tool was to allow administrators to "publish" packages from the web tool, and specify which end-user's machines the software should be installed on. At that point, all that the administrator would need to do is ensure all of the machines they're responsible for have ADA installed and they would be able to remotely push software package installs to any machine, and have it self-report on its status, enable/disable automatic updating of that software, and a variety of other features.</p>
          <h3>Even More Advanced Customization</h3>
          <p>An important consideration of the technical implementation of the packages the Custom Install tool created was that we still leave the customized packages editable even when downloaded onto the admin's machine. This is possible because the installer's customization is written to a simple .INI file that is available within installer package.</p>
          <p>While we were able to account for the vast majority of customization, there would always be those that were either more familiar or would want greater flexibility to customize their packages, so an early feature suggestion for the Custom Install tool was to allow admins to edit the .INI file directly in the browser, making it easier to pass highly customized packages around to their team (versus having to download, edit, and then manually reshare).</p>
        </div>
      </div>
      <div class="content-section">
        <h2>The Process: A Collaborative Journey</h2>
        <div class="content-section__inner">
          <p>Achieving this vision required deep collaboration with Autodesk's internal teams and enterprise customers. I adopted a rapid iteration approach with tight feedback loops from all stakeholders.</p>
          <h3>Research & Discovery</h3>
          <p>I conducted an extensive audit of Autodesk's existing installation systems:</p>
          <ul>
            <li>Mapped out 100+ installer workflows, identifying redundancies and commonalities</li>
            <li>Engaged directly with CAD/BIM managers through interviews and workshops</li>
            <li>Created a comprehensive spreadsheet of all installer capabilities across products</li>
          </ul>
          <h3>Customer Feedback Council</h3>
          <p>We established the Autodesk Software Deployment Delta Team, comprising around 30 administrators from various company sizes. Through monthly workshops, we gathered feedback, addressed concerns, and validated our approach. This continuous dialogue ensured we were building something that would truly serve our users' needs.</p>
        </div>
      </div>
      <div class="content-section">
        <h2>The Impact: A New Era of Efficiency</h2>
        <div class="content-section__inner">
          <p>The launch of Custom Install marked a transformative moment for Autodesk and its customers:</p>
          <div class="benefits-grid">
            <div class="benefit">
              <h3>Efficiency Gains</h3>
              <p>Reduced installation times by 60% (from days to hours)</p>
            </div>
            <div class="benefit">
              <h3>Scale</h3>
              <p>Enabled creation of over 30,000 installation packages in first 90 days</p>
            </div>
            <div class="benefit">
              <h3>Innovation</h3>
              <p>Unified workflows across 100+ products, paving way for future growth</p>
            </div>
            <div class="benefit">
              <h3>Remote Work</h3>
              <p>Enabled administrators to work remotely, which proved crucial during the pandemic</p>
            </div>
          </div>
          <div class="quote">
            <p>"Custom Install has changed how we work. What used to take days now happens in hours, and I can trust that my team is always using the right tools."</p>
            <cite>— Enterprise CAD Manager</cite>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="floating-tldr">
    <button onclick="document.body.classList.add('modal-open'); document.getElementById('tldrModal').classList.add('active')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      TL;DR
    </button>
  </div>
</div>
<script>
  // Show/hide floating TL;DR button based on scroll position
  const floatingTldr = document.querySelector('.floating-tldr');
  const introSection = document.querySelector('.intro-section');

  window.addEventListener('scroll', () => {
    if (introSection && window.scrollY > introSection.offsetTop + introSection.offsetHeight) {
      floatingTldr.classList.add('visible');
    } else {
      floatingTldr.classList.remove('visible');
    }
  });

  // Randomize the animation delay for each falling box on every animation cycle
  document.querySelectorAll('.parachute-box').forEach(box => {
    // Set an initial random delay between 0 and 2 seconds
    box.style.animationDelay = Math.random() *2 + "s";
    // Upon each animation iteration, assign a new random delay
    box.addEventListener('animationiteration', function() {
      box.style.animationDelay = Math.random()* 2 + "s";
    });
  });
</script>
