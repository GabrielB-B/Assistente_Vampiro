interface AnkhMarkProperties {
  readonly className?: string;
}

export function AnkhMark({ className }: AnkhMarkProperties) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 48 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="24"
        cy="15.5"
        fill="none"
        rx="9.6"
        ry="12.4"
        stroke="currentColor"
        strokeWidth="2.35"
      />
      <path
        d="M23.1 27.2c-2.6 4.3-6.5 7.2-11.3 8.1-3 .5-5.8-.6-7.5-2.7 1.1 3.5.3 6.6-2.1 9.7 6.5-.8 13-2.2 19.8-4.5l.6 42.3L24 94l1.4-13.9.6-42.3c6.8 2.3 13.3 3.7 19.8 4.5-2.4-3.1-3.2-6.2-2.1-9.7-1.7 2.1-4.5 3.2-7.5 2.7-4.8-.9-8.7-3.8-11.3-8.1l-.9 3.1-.9-3.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
