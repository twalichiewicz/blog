# Mobile Button Design Alternatives

## Current Issues
1. **Matte black buttons** - Too stark against the soft design aesthetic
2. **Small touch targets** - 13px font with 8px 16px padding is below recommended 44px minimum
3. **Poor visual hierarchy** - Buttons compete with main navigation
4. **Limited space** - Text gets cramped on smaller screens

## Alternative 1: Floating Action Button (FAB) Pattern
```scss
.mobile-action-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8800 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  
  &.expanded {
    width: auto;
    border-radius: 28px;
    padding: 0 24px;
  }
}
```

## Alternative 2: Subtle Card Design
```scss
.mobile-action-cards {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  
  .action-card {
    flex: 1;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
  }
}
```

## Alternative 3: Expandable Profile Actions
```scss
.profile-actions-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
  
  .icon {
    width: 20px;
    height: 20px;
  }
  
  &[aria-expanded="true"] {
    background: var(--link-color);
    color: white;
  }
}

.profile-actions-menu {
  margin-top: 8px;
  padding: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .action-item {
    padding: 12px 16px;
    border-radius: 8px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }
}
```

## Alternative 4: Icon-First Approach
```scss
.mobile-quick-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  
  .quick-action {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    .icon {
      width: 24px;
      height: 24px;
      color: var(--text-color);
    }
    
    .label {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      white-space: nowrap;
      color: var(--text-color-secondary);
    }
    
    &:active {
      transform: scale(0.95);
      background: var(--link-color);
      
      .icon {
        color: white;
      }
    }
  }
}
```

## Alternative 5: Inline Text Links
```scss
.profile-action-links {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
  
  .action-link {
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px dotted currentColor;
    
    &:hover {
      border-bottom-style: solid;
    }
    
    &:not(:last-child)::after {
      content: " • ";
      color: var(--text-color-secondary);
      margin: 0 4px;
    }
  }
}
```

## Recommended Approach

Based on the site's aesthetic and UX best practices, I recommend **Alternative 2: Subtle Card Design** with these modifications:

1. **Larger touch targets**: Minimum 44px height
2. **Softer colors**: Match the site's warm, muted palette
3. **Better visual hierarchy**: Secondary to main navigation
4. **Responsive text**: Use icons on very small screens

### Implementation Example:
```scss
.mobile-buttons-container {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  
  .mobile-impact-button,
  .mobile-contact-button {
    flex: 1;
    min-height: 44px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    
    // Remove harsh black styling
    &:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: var(--link-color);
      color: var(--link-color);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
    
    // Icon support for small screens
    @media (max-width: 320px) {
      padding: 12px;
      font-size: 0;
      
      &::before {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background-size: contain;
        font-size: 14px;
      }
      
      &.mobile-impact-button::before {
        content: '📊';
      }
      
      &.mobile-contact-button::before {
        content: '💬';
      }
    }
  }
}

// Dark mode adjustments
@media (prefers-color-scheme: dark) {
  .mobile-buttons-container {
    .mobile-impact-button,
    .mobile-contact-button {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.15);
      color: var(--text-color-dark);
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: var(--link-color-dark);
        color: var(--link-color-dark);
      }
    }
  }
}
```

This approach:
- Maintains consistency with the site's design language
- Provides better accessibility with larger touch targets
- Offers subtle visual feedback without being harsh
- Scales gracefully on very small screens
- Works well in both light and dark modes