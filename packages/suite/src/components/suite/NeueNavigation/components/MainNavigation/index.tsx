import React from 'react';
import { findRouteByName } from '@suite-utils/router';
import styled, { css } from 'styled-components';
import { colors, variables } from '@trezor/components';
import { Translation } from '@suite-components';
import { MAIN_MENU_ITEMS } from '@suite-constants/menu';
import { useAnalytics, useActions, useSelector } from '@suite-hooks';
import * as routerActions from '@suite-actions/routerActions';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
`;

interface ComponentProps {
    isActive: boolean;
    isDisabled?: boolean;
}

const MenuItem = styled.div<ComponentProps>`
    display: flex;
    cursor: ${props => (!props.isDisabled ? 'pointer' : 'auto')};
    /* font-size: ${props => (props.isActive ? '20px' : '16px')}; */
    font-size: 16px;

    ${props =>
        props.isActive &&
        css`
            /* same as font-size: 20px */
            transform: scale(1.25);
        `}

    & + & {
        margin-left: 24px;
    }
`;

const ItemTitleWrapper = styled.span`
    position: relative;
`;

const ItemTitle = styled.span<ComponentProps>`
    color: ${colors.BLACK50};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};

    ${props =>
        props.isActive &&
        css`
            color: ${colors.BLACK25};
        `}
`;

const NewBadge = styled.span`
    position: absolute;
    top: -12px;
    right: -12px;
    padding: 3px;
    background: ${colors.NEUE_BG_LIGHT_GREEN};
    color: ${colors.NEUE_TYPE_GREEN};
    letter-spacing: 0.2px;
    text-transform: UPPERCASE;
    font-size: 12px;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    border-radius: 4px;
`;

interface Props {
    openSecondaryMenu?: () => void;
}

const MainNavigation = (props: Props) => {
    const analytics = useAnalytics();
    const activeApp = useSelector(state => state.router.app);
    const { goto } = useActions({
        goto: routerActions.goto,
    });

    const gotoWithReport = (routeName: typeof MAIN_MENU_ITEMS[number]['route']) => {
        switch (routeName) {
            case 'suite-index':
                analytics.report({ type: 'menu/goto/suite-index' });
                break;
            case 'exchange-index':
                analytics.report({ type: 'menu/goto/exchange-index' });
                break;
            case 'wallet-index':
                analytics.report({ type: 'menu/goto/wallet-index' });
                break;
            default:
            // no default
        }
        goto(routeName);
    };

    return (
        <Wrapper>
            {MAIN_MENU_ITEMS.map(item => {
                const { route, translationId, isDisabled } = item;
                const routeObj = findRouteByName(route);
                const isActive = routeObj ? routeObj.app === activeApp : false;
                const callback = (isActive && props.openSecondaryMenu) || gotoWithReport;
                return (
                    <MenuItem
                        key={route}
                        data-test={`@suite/menu/${route}`}
                        onClick={() => !isDisabled && callback(route)}
                        isActive={isActive}
                        isDisabled={isDisabled}
                    >
                        <ItemTitleWrapper>
                            <ItemTitle isActive={isActive} isDisabled={isDisabled}>
                                <Translation id={translationId} />
                            </ItemTitle>
                            {isDisabled && <NewBadge>new</NewBadge>}
                        </ItemTitleWrapper>
                    </MenuItem>
                );
            })}
        </Wrapper>
    );
};

export default MainNavigation;