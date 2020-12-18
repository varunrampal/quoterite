import React from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom'
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link'

export type LinkProps = MuiLinkProps & Pick<RouterLinkProps, 'to' | 'replace'>

const createLink: React.FC<LinkProps> = ({...rest }) => {
  return <RouterLink {...rest} />
}

const AppLink: React.FC<LinkProps> = props => {
  return <MuiLink {...props} component={createLink} />
}

export default AppLink