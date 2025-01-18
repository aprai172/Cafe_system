import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';

/**
 * @param {object} props
 * @param {Function} [props.onBackDropClick]           - Called when backdrop is clicked
 * @param {Function} [props.onDrag]                   - Called when bottom sheet is closed by drag
 * @param {React.ReactNode} props.children            - The sheet content
 * @param {boolean} [props.isStatic=false]            - Fixed height vs. dynamic
 * @param {number} [props.staticHeight=300]           - Height if isStatic=true
 * @param {boolean} [props.disabledBackDropClick=false] - Disable closing on backdrop click
 * @param {boolean} [props.disabledGesture=false]      - Disable drag-to-close gesture
 * @param {number} [props.dragTime=10]                - Snap-back animation duration (ms)
 * @param {number} [props.smoothTime=350]             - Open/close animation duration (ms)
 * @param {number} [props.maxHeightPercent=75]        - % of screen height used as max
 * @param {boolean} [props.enableKeyboardAvoidingView=true] - Placeholder (for parity)
 * @param {number} [props.dragThresholdPercent=25]     - % of screen height to close by drag
 */
const BottomSheet = forwardRef((props, ref) => {
  const {
    onBackDropClick,
    onDrag,
    children,
    isStatic = false,
    staticHeight = 300,
    disabledBackDropClick = false,
    disabledGesture = false,
    dragTime = 10,
    smoothTime = 350,
    maxHeightPercent = 75,
    enableKeyboardAvoidingView = true, // Not directly used in web
    dragThresholdPercent = 25,
  } = props;

  const SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 0;
  const MAX_HEIGHT = useMemo(
    () => SCREEN_HEIGHT * (maxHeightPercent / 100),
    [SCREEN_HEIGHT, maxHeightPercent],
  );

  const [visible, setVisible] = useState(false);
  const [translateY, setTranslateY] = useState(SCREEN_HEIGHT);
  const [contentHeight, setContentHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  // Mouse/touch initial positions
  const startYRef = useRef(0);
  const startTranslateYRef = useRef(0);

  // expose open/close methods to parent
  useImperativeHandle(ref, () => ({
    open: () => {
      if (!visible) {
        setVisible(true);
      }
    },
    close: () => {
      animateOffScreen();
    },
  }));

  /** Animate the sheet off-screen and unmount after animation ends */
  const animateOffScreen = useCallback(() => {
    setTranslateY(SCREEN_HEIGHT);
    // hide modal after animation
    setTimeout(() => setVisible(false), smoothTime);
  }, [SCREEN_HEIGHT, smoothTime]);

  // handle dynamic or static height
  const dynamicHeightStyle = useMemo(() => {
    if (isStatic) {
      return staticHeight;
    }
    return Math.min(contentHeight, MAX_HEIGHT);
  }, [contentHeight, isStatic, staticHeight, MAX_HEIGHT]);

  // When visible changes, animate in or out
  useEffect(() => {
    if (visible) {
      // Animate up into view
      setTranslateY(0);
    } else {
      // If not triggered by close() directly, ensure it's off-screen
      setTranslateY(SCREEN_HEIGHT);
    }
  }, [visible, SCREEN_HEIGHT]);

  // measure content height when children changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  // DRAGGING threshold
  const dragThreshold = useMemo(
    () => (dragThresholdPercent / 100) * SCREEN_HEIGHT,
    [dragThresholdPercent, SCREEN_HEIGHT],
  );

  // pointer down (mouseDown/touchStart)
  const onPointerDown = (e) => {
    if (disabledGesture) return;

    setIsDragging(true);
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startTranslateYRef.current = translateY;
  };

  // pointer move (mouseMove/touchMove)
  const onPointerMove = (e) => {
    if (!isDragging || disabledGesture) return;

    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const diff = clientY - startYRef.current;

    // only drag downward
    if (diff > 0) {
      setTranslateY(startTranslateYRef.current + diff);
    }
  };

  // pointer up (mouseUp/touchEnd)
  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const movedDistance = translateY - startTranslateYRef.current;
    if (movedDistance > dragThreshold) {
      // close
      animateOffScreen();
      onDrag && onDrag();
    } else {
      // snap back
      setTranslateY(startTranslateYRef.current);
      setTimeout(() => {
        setTranslateY(0);
      }, dragTime);
    }
  };

  // attach global listeners for mouse/touch move
  useEffect(() => {
    const handleMove = (e) => onPointerMove(e);
    const handleUp = () => onPointerUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchend', handleUp);
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove, { passive: false });
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove, { passive: false });
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  // STYLES
  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: visible ? 'block' : 'none',
    zIndex: 1000,
  };

  const sheetContainerStyle = {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    // move the sheet via translateY
    transform: `translateY(${translateY}px)`,
    transition: isDragging
      ? 'none'
      : `transform ${smoothTime}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
    backgroundColor: '#fff',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
    zIndex: 1001,
    height: dynamicHeightStyle,
    maxHeight: `${MAX_HEIGHT}px`,
    overflow: 'hidden',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={backdropStyle}
        onClick={() => {
          if (!disabledBackDropClick) {
            animateOffScreen();
            onBackDropClick && onBackDropClick();
          }
        }}
      />

      {/* Bottom Sheet */}
      {visible && (
        <div
          ref={sheetRef}
          style={sheetContainerStyle}
          // attach pointer down events for dragging
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
        >
          <div
            ref={contentRef}
            style={{
              width: '100%',
              height: '100%',
              overflowY: isStatic ? 'auto' : 'visible',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
});

export default BottomSheet;
