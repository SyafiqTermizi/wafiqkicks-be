import * as React from "react";

interface Props {
  title: string;
}

export const TitleBar: React.FC<Props> = ({ title }) => (
  <nav className="fixed-top navbar navbar-expand-lg navbar-light bg-white">
    <a className="navbar-brand text-primary" href="#">
      <b>{title}</b>
    </a>
  </nav>
);
