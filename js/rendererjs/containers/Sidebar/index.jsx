import React from 'react'
import AssetSVG from 'components/AssetSVG'
import styled from 'styled-components'
import ds from 'theme'

class Sidebar extends React.Component {
  render () {
    return (
      <SidebarWrap>
        <LogoWrap>
          <span>v1.3.4</span>
        </LogoWrap>
        <NavWrap>
          <ul>
            <li>Wallet</li>
            <li>Files</li>
            <li>Hosting</li>
            <li>Advanced</li>
          </ul>
        </NavWrap>
      </SidebarWrap>
    )
  }
}

const SidebarWrap = styled.div`
  background: ${ds.color('sky', 'lighter')};
  padding: ${ds.spacing(3)};
`

const LogoWrap = styled.div`
  svg {
    display: inline-block;
    width: 50%;
  }
  span {
    margin-left: ${ds.spacing(0)};
    font-weight: 600;
    color: ${ds.color('grey')}
  }

`

const NavWrap = styled.div`
  padding-top: ${ds.spacing(4)};
  font-weight: 400;
  ul {
    list-style: none;
    padding-left: 0;
    li {
      text-transform: uppercase;
      color: ${ds.color('ink')};
      font-weight: 600;
      margin-bottom: ${ds.spacing(1)};
    }
  }
`

export default Sidebar
