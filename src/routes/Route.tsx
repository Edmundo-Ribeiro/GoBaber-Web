import React from 'react';
import {
  Redirect,
  Route as ReactDomRoute,
  RouteProps as ReactDomRouteProps,
} from 'react-router-dom';
import { useAuth } from '../hooks/Auth';

interface RouteProps extends ReactDomRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  const destination = isPrivate ? '/' : '/dashboard';

  return (
    <ReactDomRoute
      {...rest}
      render={({ location }) => {
        return !!user === isPrivate ? (
          <Component />
        ) : (
          <Redirect to={{ pathname: destination, state: { from: location } }} />
        );
      }}
    />
  );
};

export default Route;
