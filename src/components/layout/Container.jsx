// Container is a simple layout helper that applies the global .container styles.
export function Container({ children, className = "" }) {
  const classes = ["container", className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}
