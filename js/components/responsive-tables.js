/**
 * Responsive Tables Component
 * Handles table scroll indicators, sticky headers, and mobile optimizations
 */

const processedContainers = new WeakSet();
const defaultDevicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
let lastDevicePixelRatio = defaultDevicePixelRatio;
let zoomIntervalId = null;

function updateScrollState(container, table) {
  const hasScroll = table.scrollWidth > container.clientWidth;
  const scrollLeft = container.scrollLeft;
  const maxScroll = table.scrollWidth - container.clientWidth;

  container.classList.toggle('has-scroll', hasScroll);
  container.classList.toggle('scrolled', scrollLeft > 10);
  container.classList.toggle('at-end', scrollLeft >= maxScroll - 10);

  if (hasScroll) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Scrollable table');
    container.setAttribute('tabindex', '0');
  }
}

function ensureZoomWatcher() {
  if (zoomIntervalId !== null) {
    return;
  }

  zoomIntervalId = setInterval(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.devicePixelRatio === lastDevicePixelRatio) {
      return;
    }

    lastDevicePixelRatio = window.devicePixelRatio;

    document.querySelectorAll('.table-scroll-container').forEach(container => {
      const table = container.querySelector('table');
      if (!table) return;
      updateScrollState(container, table);
    });
  }, 500);
}

function bindContainer(container, table) {
  const checkScroll = () => updateScrollState(container, table);
  checkScroll();

  if (!container._responsiveScrollHandler) {
    const onScroll = () => checkScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    container._responsiveScrollHandler = onScroll;
  }

  if (!container._responsiveResizeHandler) {
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScroll, 100);
    };
    window.addEventListener('resize', onResize, { passive: true });
    container._responsiveResizeHandler = onResize;
  }

  if ('ontouchstart' in window && !container._responsiveTouchHandlers) {
    container.style.scrollbarWidth = 'thin';
    container.style.WebkitOverflowScrolling = 'touch';

    let touchStartX = 0;
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 5) {
        container.classList.add('touch-scrolling');
      }
    };
    const handleTouchEnd = () => {
      container.classList.remove('touch-scrolling');
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    container._responsiveTouchHandlers = {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    };
  }

  if (!container._responsiveKeydownHandler) {
    const handleKeydown = (e) => {
      const scrollAmount = 50;

      switch (e.key) {
        case 'ArrowLeft':
          container.scrollLeft -= scrollAmount;
          e.preventDefault();
          break;
        case 'ArrowRight':
          container.scrollLeft += scrollAmount;
          e.preventDefault();
          break;
        case 'Home':
          container.scrollLeft = 0;
          e.preventDefault();
          break;
        case 'End':
          container.scrollLeft = container.scrollWidth;
          e.preventDefault();
          break;
      }
    };

    container.addEventListener('keydown', handleKeydown);
    container._responsiveKeydownHandler = handleKeydown;
  }

  if (!container._responsiveFocusHandlers) {
    const handleFocus = () => container.classList.add('focused');
    const handleBlur = () => container.classList.remove('focused');

    container.addEventListener('focus', handleFocus);
    container.addEventListener('blur', handleBlur);

    container._responsiveFocusHandlers = { handleFocus, handleBlur };
  }

  processedContainers.add(container);
}

export function initResponsiveTables() {
  const scrollContainers = document.querySelectorAll('.table-scroll-container');

  scrollContainers.forEach(container => {
    const table = container.querySelector('table');
    if (!table) return;

    if (!processedContainers.has(container)) {
      bindContainer(container, table);
    } else {
      updateScrollState(container, table);
    }
  });

  ensureZoomWatcher();
}

export function destroyResponsiveTables() {
  document.querySelectorAll('.table-scroll-container').forEach(container => {
    if (!processedContainers.has(container)) return;

    if (container._responsiveScrollHandler) {
      container.removeEventListener('scroll', container._responsiveScrollHandler);
      delete container._responsiveScrollHandler;
    }

    if (container._responsiveResizeHandler) {
      window.removeEventListener('resize', container._responsiveResizeHandler);
      delete container._responsiveResizeHandler;
    }

    if (container._responsiveTouchHandlers) {
      const { handleTouchStart, handleTouchMove, handleTouchEnd } = container._responsiveTouchHandlers;
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      delete container._responsiveTouchHandlers;
    }

    if (container._responsiveKeydownHandler) {
      container.removeEventListener('keydown', container._responsiveKeydownHandler);
      delete container._responsiveKeydownHandler;
    }

    if (container._responsiveFocusHandlers) {
      const { handleFocus, handleBlur } = container._responsiveFocusHandlers;
      container.removeEventListener('focus', handleFocus);
      container.removeEventListener('blur', handleBlur);
      delete container._responsiveFocusHandlers;
    }

    processedContainers.delete(container);
  });

  if (zoomIntervalId !== null) {
    clearInterval(zoomIntervalId);
    zoomIntervalId = null;
    lastDevicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  }
}
