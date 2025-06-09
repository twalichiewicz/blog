---
title: "Design Systems: Expectations & Realities"
layout: blog_post
show_title: true
cover_image: https://res.cloudinary.com/bornfight-studio/image/upload/v1678372951/bornfight-web-2022/https_lh4_googleusercontent_ce39fbc90f.png
date: 2023-05-05 12:00:00
reading_time: 15 minutes
long: true
excerpt: Have you ever wondered what it takes to build a successful design system library? In 2019, I embarked on this journey and created my own library. Now, I'm excited to share the insights I've gained after working on this project, as well as others. In this post, I'll cover the myths and realities of design systems, and how they can be implemented successfully in your own organization.
draft: true
tags:
  - blog
---

## Standardizing designs

To begin, let's align on what exactly we're talking about when we say "design system":

[via Nielsen Norman Group:](https://www.nngroup.com/articles/design-systems-101/)

> A design system is a set of standards to manage design at scale by reducing redundancy while creating a shared language and visual consistency across different pages and channels.

Contrast this with the more traditional approach, "human interface guidelines":

[via Wikipedia:](https://en.wikipedia.org/wiki/Human_interface_guidelines)

> Human interface guidelines (HIG) are software development documents which offer application developers a set of recommendations. Their aim is to improve the experience for the users by making application interfaces more intuitive, learnable, and consistent.

Design systems are created to provide consistency and efficiency in the design process. They can help designers save time and reduce the risk of errors by providing pre-designed components, typography, color schemes, and other design elements. However, relying too heavily on a design system can limit a designer's ability to explore and experiment with new ideas and approaches.

Additionally, design systems are often created to serve a broad range of products and use cases, which may not always align with the specific needs of individual users or products. Over-reliance on the design system can lead to a "one size fits all" approach that does not adequately address the unique needs of users or products.

### The good

1. **The elements of your design share a consistent language.**
   A design system ensures consistency across all products, features, and touch-points, reducing the likelihood of errors or confusion. Changes made to the design system can be easily shared among components and pages, and duplication of work can be minimized.

2. **Faster development time due to design / code parity.**
   When design elements and codebase are tightly integrated, designers and developers are able to work together more efficiently and collaboratively, reducing the amount of time and effort required to implement designs. By using pre-designed components, patterns, and guidelines, teams can avoid reinventing the wheel for every feature they implement. This allows them to focus on the unique aspects of each design rather than wasting time on repetitive tasks.

### The bad

1. **The implementation of a design system can be time-consuming and costly, especially when trying to retrofit existing designs and systems.**
   The most intensive part of building a custom system is designing the components that make up the system. Every interaction with your product matters, and the components must be designed with an eye for comprehension and ease of use. Fitt's law compliant components react to user input in a multitude of ways to make a product feel more responsive. Moreover, special attention is given to making a user experience with each component a pleasure to use by adding small animations and transitions to every interaction.

2. **Design system updates and changes can lead to compatibility issues and errors, requiring significant effort to resolve.**
   To make the transition from design mockup to product code seamless, components are built in such a way that engineers can mimic all the changes designers could make. Styles are simple to update, thanks to a nested LESS architecture that makes wide-reaching changes easy. The design system's breadth is also a crucial factor, as it provides a shared language of components that eliminates the need to reinvent the wheel every time a new project begins.

   Remember a couple sentences ago when I said that one of the Good items about Design Systems is design / code parity? In reality that pipe-dream is much more complicated problem to solve than it seems.
   a. Unless you have a pipeline for directly publishing designs into your codebase, you're going to take on the responsibility of checking that your designs have be correctly implemented in code. (As opposed to trusting a previously created / vetted design library).

### The ugly

1. **Design Systems can be an expensive, inescapable quagmire.**
   Advocating for fixing design debts puts other feature work on the back-burner, and that is a big no-no for startups that rely on every feature to bring in a slew of new customers.

   The final challenge revolves around making the user experience with each component a pleasure to use. To achieve this, small animations and transitions are added to every interaction. The Human Interest design system comes into its own when used to build interfaces. All the previous considerations and component design come together to create a cohesive experience, making it drag-and-drop simple to implement in production.

2. **Over-reliance on the design system can stifle creativity and innovation, leading to a generic and unremarkable user experience.**
   It's much harder than you think to convince leadership a design system is valuable.

3. **The strict adherence to a design system can make it difficult to accommodate unique user needs and preferences.**
   Yes, it's true that a lot of patterns solve a user's problem _most_ of the way. Bt how much more could you have solved it had you not decided to end your solution-seeking short by sticking to an existing pattern?