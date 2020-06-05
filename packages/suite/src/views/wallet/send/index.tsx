import { SendContext } from '@suite/hooks/wallet/useSendContext';
import { WalletLayout } from '@wallet-components';
import { Card, Translation } from '@suite-components';
import React, { useState } from 'react';
import styled from 'styled-components';
import { variables, colors } from '@trezor/components';
import Outputs from './components/Outputs';
import Clear from './components/Clear';
import AdvancedForm from './components/AdvancedForm';
import ReviewButton from './components/ReviewButton';
import { Props } from './Container';
import { useForm, FormContext } from 'react-hook-form';

const Header = styled.div`
    display: flex;
    padding: 6px 12px;
`;

const HeaderLeft = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    text-transform: uppercase;
    color: ${colors.BLACK50};
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
`;

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
`;

export default ({ device, fees, selectedAccount, locks, online, settings, fiat }: Props) => {
    if (!device || !fees || selectedAccount.status !== 'loaded') {
        return <WalletLayout title="Send" account={selectedAccount} />;
    }

    const { account } = selectedAccount;
    const { symbol } = account;
    const [advancedForm, showAdvancedForm] = useState(false);
    const [feeOutdated, setFeeOutdated] = useState(false);
    const [selectedFee, setSelectedFee] = useState({ label: '1', value: '1' });
    const [outputs, updateOutputs] = useState([
        {
            id: 0,
            address: '',
            amount: '',
            setMax: false,
            fiatValue: '',
            localCurrency: { value: 'usd', label: 'USD' },
        },
    ]);

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            'address-0': '',
            'amount-0': '',
            'fiatValue-0': '',
            fiatCurrency: '',
            fee: '1',
            feeLimit: '1',
        },
    });

    return (
        <WalletLayout title="Send" account={selectedAccount}>
            <SendContext.Provider
                value={{
                    outputs,
                    updateOutputs,
                    selectedFee,
                    setSelectedFee,
                    advancedForm,
                    showAdvancedForm,
                    account,
                    settings,
                    fiat,
                    fees,
                    feeOutdated,
                    setFeeOutdated,
                    device,
                    online,
                    locks,
                }}
            >
                <FormContext {...methods}>
                    <StyledCard
                        customHeader={
                            <Header>
                                <HeaderLeft>
                                    <Translation
                                        id="SEND_TITLE"
                                        values={{ symbol: symbol.toUpperCase() }}
                                    />
                                </HeaderLeft>
                                <HeaderRight>
                                    <Clear />
                                </HeaderRight>
                            </Header>
                        }
                    >
                        <Outputs />
                        <AdvancedForm />
                        <ReviewButton />
                    </StyledCard>
                </FormContext>
            </SendContext.Provider>
        </WalletLayout>
    );
};
