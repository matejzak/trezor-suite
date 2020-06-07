import { QuestionTooltip, Translation } from '@suite-components';
import { capitalizeFirstLetter } from '@suite-utils/string';
import { useSendContext } from '@suite/hooks/wallet/useSendContext';
import { Button, colors, P, Select, variables } from '@trezor/components';
import { Account } from '@wallet-types';
import { formatNetworkAmount } from '@wallet-utils/accountUtils';
import { calculateEthFee } from '@wallet-utils/sendFormUtils';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { FeeLevel } from 'trezor-connect';
import { fromWei, toWei } from 'web3-utils';

import CustomFee from './components/CustomFee';

const Row = styled.div`
    display: flex;
    flex-direction: column;
`;

const Text = styled.div`
    margin-right: 3px;
`;

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const Top = styled.div`
    padding: 0 0 10px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const Column = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`;

const Label = styled(Column)`
    color: ${colors.BLACK0};
`;

const Refresh = styled(Column)`
    color: ${colors.BLACK0};
    justify-content: flex-end;
`;

const RefreshText = styled.div`
    padding: 0 5px;
    cursor: pointer;
    white-space: nowrap;
    color: ${colors.RED};
    font-size: ${variables.FONT_SIZE.TINY};
`;

const OptionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const OptionValue = styled(P)`
    min-width: 70px;
    margin-right: 5px;
    display: flex;
    justify-content: flex-start;
    text-indent: 1ch;
    align-items: center;
    padding-top: 2px;

    font-size: ${variables.FONT_SIZE.TINY};
    color: ${colors.BLACK50};
`;

const OptionLabel = styled(P)`
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    word-break: break-all;
`;

const getValue = (
    networkType: Account['networkType'],
    option: FeeLevel,
    symbol: Account['symbol'],
) => {
    const { feePerUnit, feeLimit } = option;

    if (networkType === 'bitcoin') {
        return `${feePerUnit} sat/B`;
    }

    if (networkType === 'ethereum') {
        const fee = calculateEthFee(feePerUnit, feeLimit || '0');
        try {
            const gasPriceInWei = toWei(fee, 'gwei');
            const gasPriceInEth = fromWei(gasPriceInWei, 'ether');
            return `${gasPriceInEth} ${symbol.toUpperCase()}`;
        } catch (err) {
            return feePerUnit;
        }
    }

    return `${formatNetworkAmount(feePerUnit, symbol)} ${symbol.toUpperCase()}`;
};

export default () => {
    const { account, feeInfo, feeOutdated, selectedFee, setSelectedFee } = useSendContext();
    const { formState } = useFormContext();
    const dataIsDirty = formState.dirtyFields.has('ethereum-data');
    const { networkType, symbol } = account;

    return (
        <Wrapper>
            <Row>
                <Top>
                    <Label>
                        <Text>
                            <Translation id="TR_FEE" />
                        </Text>
                        <QuestionTooltip messageId="TR_SEND_FEE_TOOLTIP" />
                    </Label>
                    {feeOutdated && (
                        <Refresh>
                            <RefreshText>
                                <Translation id="TR_FEE_NEEDS_UPDATE" />
                            </RefreshText>
                            <Button
                                // onClick={() => manuallyUpdateFee()}
                                icon="REFRESH"
                                variant="tertiary"
                                alignIcon="right"
                            >
                                <Translation id="REFRESH" />
                            </Button>
                        </Refresh>
                    )}
                </Top>
                <Select
                    variant="small"
                    isSearchable={false}
                    // hack for react select, it needs the "value"
                    value={{ ...selectedFee, value: selectedFee.feePerUnit }}
                    onChange={(selectedFeeLevel: FeeLevel) => setSelectedFee(selectedFeeLevel)}
                    options={feeInfo.levels}
                    isDisabled={networkType === 'ethereum' && dataIsDirty}
                    formatOptionLabel={(option: FeeLevel) => (
                        <OptionWrapper>
                            <OptionLabel>{capitalizeFirstLetter(option.label)} </OptionLabel>
                            {option.feePerUnit !== '0' && (
                                <OptionValue>{getValue(networkType, option, symbol)}</OptionValue>
                            )}
                        </OptionWrapper>
                    )}
                />
            </Row>
            {networkType !== 'ethereum' && selectedFee.label === 'custom' && <CustomFee />}
        </Wrapper>
    );
};
