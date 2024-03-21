/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const PageDetailViewModelContext = React.createContext();

export const PageDetailViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <PageDetailViewModelContext.Provider value={viewModel}>
      {children}
    </PageDetailViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const usePageDetailViewModel = () => React.useContext(PageDetailViewModelContext);

/* HOC to inject store to any functional or class component */
export const withPageDetailViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={usePageDetailViewModel()} />;
};
