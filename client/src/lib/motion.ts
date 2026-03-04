export const motionPreset = {
  page: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  hoverLift: {
    whileHover: { y: -2 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};
