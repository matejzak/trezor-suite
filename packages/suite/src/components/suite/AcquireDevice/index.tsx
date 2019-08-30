import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Notification } from '@trezor/components';
import { acquireDevice } from '@suite-actions/suiteActions';
import { AppState } from '@suite-types';
import l10nMessages from './index.messages';

interface Props extends InjectedIntlProps {
    device: AppState['suite']['device'];
    acquireDevice: typeof acquireDevice;
}

const Acquire: FunctionComponent<Props> = props => {
    const { device } = props;
    if (!device) return null;
    return (
        <Notification
            title={props.intl.formatMessage(l10nMessages.TR_DEVICE_USED_IN_OTHER)}
            message={props.intl.formatMessage(l10nMessages.TR_USE_YOUR_DEVICE_IN_THIS_WINDOW)}
            variant="info"
            cancelable={false}
            // todo: imho currently there is no field in global state showing that call to device is in progress, but I could use local state
            // here possibly too
            // isActionInProgress={props.acquiring}
            actions={[
                {
                    label: props.intl.formatMessage(l10nMessages.TR_ACQUIRE_DEVICE),
                    callback: props.acquireDevice,
                },
            ]}
        />
    );
};

const mapStateToProps = (state: AppState) => ({
    device: state.suite.device,
});

export default injectIntl(
    connect(
        mapStateToProps,
        dispatch => ({
            acquireDevice: bindActionCreators(acquireDevice, dispatch),
        }),
    )(Acquire),
);
