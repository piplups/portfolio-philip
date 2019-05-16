import React, { Component } from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { withAuth } from '@okta/okta-react';


/*
    Creating a new React component and setting the initial values.
    Material UI will use menuAnchorE1 to know where 
    to anchor the menu that lets you log the user out
*/
class LoginButton extends Component {
    state = {
        authenticated: null,
        user: null,
        menuAnchorEl: null,
    };

    /**
     * React components also have their own lifecycle methods: componentDidUpdate,
     * componentDidMount, and asyc checkAuthentication.
     */
    componentDidUpdate() {
        this.checkAuthentication();
    }

    componentDidMount() {
        this.checkAuthentication();
    }

    async checkAuthentication() {
        const authenticated = await this.props.auth.isAuthenticated();
        if (authenticated !== this.state.authenticated) {
            const user = await this.props.auth.getUser();
            this.setState({ authenticated, user });
        }
    }

    // Use of an arrow function ensures that this is referring
    // to the instantiation of the component.
    login = () => this.props.auth.login();
    logout = () => {
        this.handleMenuClose();
        this.props.auth.logout();
    };

    handleMenuOpen = event => this.setState({ menuAnchorE1: event.currentTarget });
    handleMenuClose = () => this.setState({ menuAnchorE1: null });

    render() {
        const { authenticated, user, menuAnchorE1 } = this.state;

        if(authenticated == null) return null;
        if(!authenticated) return <Button color="inherit" onClick={this.login}>Login</Button>;

        const menuPosition = {
            vertical: 'top',
            horizontal: 'right',
        };
        
        // All react components must have a render() function.
        return (
            <div>
                <IconButton onClick={this.handleMenuOpen} color="inherit">
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorE1={menuAnchorE1}
                    anchorOrigin={menuPosition}
                    transformOrigin={menuPosition}
                    open={!!menuAnchorE1}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem onClick={this.logout}>
                        <ListItemText 
                            primary="Logout"
                            secondary={user && user.name}
                        />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

// withAuth function is a Higher Order Component which
// wraps the original component and returns another one
// containing the auth prop.
export default withAuth(LoginButton);