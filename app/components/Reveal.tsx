import { useAnimation, useInView, motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

interface RevealProps {
  children: ReactNode;
  width: string;
  className: string;
  duration: number;
  amount: number;
  revealStyle: 'BT' | 'LR' | undefined;
}

const translationProps = {
  BT: 'y',
  LR: 'x',
};
const translationValues = {
  LR: {
    hidden: -100,
    visible: 0,
  },
  BT: {
    hidden: 75,
    visible: 0,
  },
};

const Reveal = ({
  children,
  width = 'fit-content',
  className = '',
  duration = 0.5,
  amount,
  revealStyle,
}: Partial<RevealProps>) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });

  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', width, overflow: 'hidden' }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            ...(revealStyle
              ? {
                  [translationProps[revealStyle]]:
                    translationValues[revealStyle].hidden,
                }
              : {}),
          },
          visible: {
            opacity: 1,
            ...(revealStyle
              ? {
                  [translationProps[revealStyle]]:
                    translationValues[revealStyle].visible,
                }
              : {}),
          },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
