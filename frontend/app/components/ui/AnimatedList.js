"use client";

import { forwardRef } from 'react';
import { StaggerContainer, StaggerItem, FadeIn } from '@/app/components/motion/MotionSystem';

/**
 * AnimatedList - Staggered animation container for lists
 * Uses StaggerContainer + StaggerItem from MotionSystem
 */
export const AnimatedList = forwardRef(function AnimatedList(
  { children, staggerDelay = 0.04, className = '', as = 'ul', ...props },
  ref
) {
  const Component = as;
  return (
    <StaggerContainer
      ref={ref}
      staggerDelay={staggerDelay}
      className={className}
      as={as === 'ul' || as === 'ol' ? '' : undefined}
      {...props}
    >
      {as === 'ul' || as === 'ol' ? (
        <Component className={className} {...props}>
          {children}
        </Component>
      ) : (
        children
      )}
    </StaggerContainer>
  );
});

/**
 * AnimatedListItem - Single animated list item
 * Wraps children with StaggerItem for staggered entry
 */
export const AnimatedListItem = forwardRef(function AnimatedListItem(
  { children, className = '', ...props },
  ref
) {
  return (
    <StaggerItem ref={ref} className={className} {...props}>
      {children}
    </StaggerItem>
  );
});

/**
 * AnimatedListGroup - A group animating in as a fade + slide
 */
export const AnimatedListGroup = forwardRef(function AnimatedListGroup(
  { children, delay = 0, className = '', ...props },
  ref
) {
  return (
    <FadeIn ref={ref} delay={delay} className={className} {...props}>
      {children}
    </FadeIn>
  );
});

export default AnimatedList;