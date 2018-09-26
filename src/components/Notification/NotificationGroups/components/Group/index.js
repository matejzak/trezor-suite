import React, { Component } from 'react';
import styled from 'styled-components';
import colors from 'config/colors';
import { Notification } from 'components/Notification';

const Wrapper = styled.div``;

const Header = styled.div`
    display: flex;
    cursor: pointer;
    background: ${colors.WHITE};
    padding: 5px 10px;
    border-bottom: 1px solid ${colors.BACKGROUND};
`;

const Body = styled.div``;

const Title = styled.div`
    color: ${props => props.color};
`;

class Group extends Component {
    constructor() {
        super();
        this.state = {
            visibleCount: 1,
            visible: true,
        };
    }

    toggle = () => {
        if (this.state.visible) {
            this.setState({
                visible: false,
                visibleCount: 0,
            });
        } else {
            this.setState({
                visible: true,
                visibleCount: this.props.groupNotifications.length,
            });
        }
    }

    render() {
        const { type, groupNotifications, color } = this.props;
        return (
            <Wrapper>
                <Header onClick={this.toggle}>
                    <Title
                        color={color}
                    >{groupNotifications.length} {groupNotifications.length > 1 ? `${type}s` : type}
                    </Title>
                </Header>
                <Body>
                    {groupNotifications
                        .slice(0, this.state.visibleCount)
                        .map(notification => (
                            <Notification
                                key={notification.title}
                                type={notification.type}
                                title={notification.title}
                                message={notification.message}
                            />
                        ))}
                </Body>
            </Wrapper>
        );
    }
}

export default Group;