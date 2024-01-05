type EmptyStateProps = {
  text: string;
};

export const EmptyState = (props: EmptyStateProps) => {
  return <>{props.text}</>;
};
