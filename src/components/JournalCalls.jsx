import React from 'react';
import { NavLink } from 'react-router-dom';

function SidebarItem({ icon: Icon, label, to }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
      >
        {Icon && <Icon size={20} />}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

export default SidebarItem;
