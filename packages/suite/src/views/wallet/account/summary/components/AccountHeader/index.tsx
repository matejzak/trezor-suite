import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import * as stateUtils from '@wallet-utils/reducerUtils';
import { CoinLogo, Link, variables } from '@trezor/components';
import l10nCommonMessages from '@suite-views/index.messages';
import l10nSummaryMessages from '../../common.messages';
import AccountBalance from './components/Balance';

const { FONT_WEIGHT, FONT_SIZE } = variables;

const AccountHeading = styled.div`
    padding-bottom: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AccountName = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AccountTitle = styled.div`
    font-size: ${FONT_SIZE.WALLET_TITLE};
    font-weight: ${FONT_WEIGHT.MEDIUM};
`;

const StyledLink = styled(Link)`
    font-size: ${FONT_SIZE.SMALL};
`;

const StyledCoinLogo = styled(CoinLogo)`
    margin-right: 10px;
`;

interface Props {
    account: any;
    network: any;
    pending: any;
    localCurrency: string;
    isHidden: boolean;
    fiatRates: any[];
}

const AccountHeader = ({
    account,
    network,
    pending,
    fiatRates,
    localCurrency,
    isHidden,
}: Props) => {
    const explorerLink = `${network.explorer.address}${account.descriptor}`;
    const pendingAmount: BigNumber = stateUtils.getPendingAmount(pending, network.symbol);
    const balance: string = new BigNumber(account.balance).minus(pendingAmount).toString(10);
    const reserve: string =
        account.networkType === 'ripple' && !account.empty ? account.reserve : '0';
    return (
        <>
            <AccountHeading>
                <AccountName>
                    <StyledCoinLogo height={23} network={account.network} />
                    <AccountTitle>
                        <FormattedMessage
                            {...(account.imported
                                ? l10nCommonMessages.TR_IMPORTED_ACCOUNT_HASH
                                : l10nCommonMessages.TR_ACCOUNT_HASH)}
                            values={{ number: parseInt(account.index, 10) + 1 }}
                        />
                    </AccountTitle>
                </AccountName>
                <StyledLink href={explorerLink} isGray>
                    <FormattedMessage {...l10nSummaryMessages.TR_SEE_FULL_TRANSACTION_HISTORY} />
                </StyledLink>
            </AccountHeading>
            <AccountBalance
                network={network}
                balance={balance}
                fiat={fiatRates}
                localCurrency={localCurrency}
                isHidden={isHidden}
                xrpReserve={reserve}
            />
        </>
    );
};

export default AccountHeader;