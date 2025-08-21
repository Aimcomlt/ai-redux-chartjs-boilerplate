import React from 'react';
import { NavLink } from 'react-router-dom';

export const SideNav: React.FC = () => (
  <nav className="side-nav">
    <ul>
      <li>
        <NavLink to="/">Overview</NavLink>
      </li>
      <li>
        <NavLink to="/model-lab">Model Lab</NavLink>
      </li>
    </ul>
  </nav>
);

export default SideNav;
