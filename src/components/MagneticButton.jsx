import { useRef, useState, useCallback } from 'react';

/**
 * MagneticButton — Interactive button that subtly follows the cursor on hover.
 * A 21st.dev-style micro-interaction using pointer events and CSS transforms.
 * On mouse leave, the button springs back to its resting position.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  as: Tag = 'button',
  ...props
}) {
  const ref = useRef(null);
  const [transform, setTransform] = useState('translate3d(0,0,0)');

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setTransform(`translate3d(${x * strength}px, ${y * strength}px, 0)`);
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('translate3d(0,0,0)');
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
