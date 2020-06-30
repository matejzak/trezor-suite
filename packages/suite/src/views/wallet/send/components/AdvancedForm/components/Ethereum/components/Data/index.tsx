import { QuestionTooltip, Translation } from '@suite-components';
import { useActions } from '@suite-hooks';
import { useSendFormContext } from '@wallet-hooks';
import { Textarea } from '@trezor/components';
import * as sendFormActions from '@wallet-actions/sendFormActions';
import { getInputState } from '@wallet-utils/sendFormUtils';
import React from 'react';
import styled from 'styled-components';
import validator from 'validator';

const Label = styled.div`
    display: flex;
    align-items: center;
`;

const Text = styled.div`
    margin-right: 3px;
`;

export default () => {
    const { formContext, sendContext } = useSendFormContext();
    const {
        token,
        setSelectedFee,
        initialSelectedFee,
        outputs,
        fiatRates,
        setTransactionInfo,
    } = sendContext;
    const { register, errors, getValues, setValue, clearError, setError } = formContext;
    const inputName = 'ethereumData';
    const { updateFeeLevelWithData } = useActions({
        updateFeeLevelWithData: sendFormActions.updateFeeLevelWithData,
    });
    const error = errors[inputName];

    return (
        <Textarea
            name={inputName}
            innerRef={register({
                validate: {
                    ethDataNotHex: (value: string) => {
                        if (value && !validator.isHexadecimal(value)) {
                            return <Translation id="TR_ETH_DATA_NOT_HEX" />;
                        }
                    },
                },
            })}
            onChange={async event => {
                if (!error) {
                    updateFeeLevelWithData(
                        event.target.value,
                        setSelectedFee,
                        initialSelectedFee,
                        token,
                        setTransactionInfo,
                        outputs,
                        fiatRates,
                        setValue,
                        clearError,
                        setError,
                        getValues,
                    );
                }
            }}
            state={getInputState(error)}
            bottomText={error && error.message}
            disabled={token !== null}
            topLabel={
                <Label>
                    <Text>
                        <Translation id="TR_SEND_DATA" />
                    </Text>
                    <QuestionTooltip messageId="TR_SEND_DATA_TOOLTIP" />
                </Label>
            }
        />
    );
};
