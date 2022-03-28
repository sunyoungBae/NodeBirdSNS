import Proptypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { useState } from 'react';
import UserProfile from '../components/UserProfile'
import LoginForm from '../components/LoginForm'
import styled from 'styled-components';

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;

const AppLayout = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 더미 데이터 사용
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput enterButton />
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {isLoggedIn ? <UserProfile setIsLoggedIn={setIsLoggedIn}/> : <LoginForm setIsLoggedIn={setIsLoggedIn}/>}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="http://www.zerocho.com" target="_blank" rel="noreferrer noopener">Made by ZeroCho</a>
                </Col>
            </Row>
        </div>
    );
}

AppLayout.prototypes = {
    children: Proptypes.node.isRequired,
};

export default AppLayout;