import { useRef, useEffect } from 'react';

/**
 * A hook that enables kinetic horizontal drag-to-scroll on scrollable elements.
 * It ignores clicks on interactive elements or HTML5 draggable cards to prevent conflicts.
 */
export default function useDragToScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let originalUserSelect = '';

    const handleMouseDown = (e) => {
      // Ignore interactive controls and draggable cards
      if (e.target.closest('button, input, select, textarea, a, [draggable="true"], .calendar-card-item')) {
        return;
      }

      isDown = true;
      el.style.cursor = 'grabbing';
      
      // Store original user-select styling and disable selection during drag
      originalUserSelect = document.body.style.userSelect || '';
      document.body.style.userSelect = 'none';

      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = 'grab';
      document.body.style.userSelect = originalUserSelect;
    };

    const handleMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = 'grab';
      document.body.style.userSelect = originalUserSelect;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      el.scrollLeft = scrollLeft - walk;
    };

    // Apply grab cursor initially
    el.style.cursor = 'grab';

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
      
      // Clean up body styling if unmounted during drag
      if (isDown) {
        document.body.style.userSelect = originalUserSelect;
      }
    };
  }, []);

  return ref;
}
