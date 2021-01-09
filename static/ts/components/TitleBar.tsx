import * as React from "react";

interface Props {
  title: string;
}

export const TitleBar: React.FC<Props> = ({ title }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-primary">
    <a className="navbar-brand text-white" href="#">
      {title}
    </a>
  </nav>
);
