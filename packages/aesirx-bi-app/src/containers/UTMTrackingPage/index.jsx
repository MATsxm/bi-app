import React, { Component, lazy } from 'react';
import { Route, matchPath } from 'react-router-dom';
import UTMTrackingStore from './UTMTrackingStore/UTMTrackingStore';
import { UTMTrackingViewModelContextProvider } from './UTMTrackingViewModels/UTMTrackingViewModelContextProvider';
import UTMTrackingViewModel from './UTMTrackingViewModels/UTMTrackingViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { history } from 'aesirx-uikit';
import { withTranslation } from 'react-i18next';
import ExportButton from 'components/ExportButton';
const UTMTracking = lazy(() => import('./UTMTracking'));
const Generator = lazy(() => import('./Generator'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'utm-tracking':
      return <UTMTracking {...props} />;
    case 'utm-tracking-generator':
      return <Generator {...props} />;

    default:
      return <UTMTracking {...props} />;
  }
};

const UTMTrackingPage = observer(
  class UTMTrackingPage extends Component {
    utmTrackingStore = null;
    utmTrackingViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.utmTrackingStore = new UTMTrackingStore({});

      this.utmTrackingViewModel = new UTMTrackingViewModel(
        this.utmTrackingStore,
        this.biListViewModel
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;

      const match = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/utm-tracking',
        exact: true,
        strict: false,
      });
      return (
        <UTMTrackingViewModelContextProvider viewModel={this.utmTrackingViewModel}>
          {(match?.isExact || integrationLink === 'utm-tracking') && (
            <ExportButton
              data={
                this?.utmTrackingViewModel?.utmTrackingEvents?.data?.list?.toEventTableUTM(true)
                  ?.data
              }
              i18n={this.props.i18n}
              t={this.props.t}
              componentRef={this.componentRef}
              sectionName={'utm-tracking'}
            />
          )}

          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </UTMTrackingViewModelContextProvider>
      );
    }
  }
);

const ComponentToPrint = observer(
  class extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="aesirxui">
          {this.props.integration ? (
            <RenderComponent
              link={this.props.integrationLink}
              activeDomain={this.props.activeDomain}
              {...this.props}
            />
          ) : (
            <>
              <Route exact path={['/utm-tracking', '/bi/utm-tracking']}>
                <UTMTracking />
              </Route>
              <Route exact path={['/utm-tracking/generator', '/bi/utm-tracking']}>
                <Generator />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withBiViewModel(UTMTrackingPage));
