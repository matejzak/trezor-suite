import React from 'react';
import styled from 'styled-components';
import { Button, colors, Tooltip } from '@trezor/components';
import { Translation } from '@suite-components';
import { TrezorDevice } from '@suite-types';

interface Props {
    onClick?: () => void;
    disabled: boolean;
    isOverlaying?: boolean;
    device?: TrezorDevice;
}

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
`;

// workaround to expand tooltip (and child button) to full width
const StyledTooltip = styled(Tooltip)``;

const StyledButton = styled(Button)``;

const AddAccountButton = ({ onClick, disabled, device }: Props) => {
    const clickHandler = !disabled ? onClick : undefined;
    const tooltipMessage =
        device && !device.connected ? (
            <Translation id="TR_TO_ADD_NEW_ACCOUNT_PLEASE_CONNECT" />
        ) : undefined;

    const ButtonRow = (
        <StyledButton
            onClick={clickHandler}
            icon="PLUS"
            variant="tertiary"
            fullWidth
            isDisabled={disabled}
        />
    );

    if (tooltipMessage) {
        return (
            <Wrapper>
                <Tooltip maxWidth={200} offset={50} content={tooltipMessage} placement="bottom">
                    {ButtonRow}
                </Tooltip>
            </Wrapper>
        );
    }
    return <Wrapper>{ButtonRow}</Wrapper>;
};

export default AddAccountButton;
