if (process.env.NEXT_PUBLIC_DEMO_MODE === 'false') {
  throw new Error(
    'Production mode is not implemented. Keep demo mode enabled until the production launch checklist is complete.',
  );
}
