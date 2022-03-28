import 'antd/dist/antd.css' // 페이지들의 공통되는 것들 처리
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head';
import wrapper from '../store/configureStore';

const NodeBird = ({Component}) => { // 다른 페이지의 컴포넌트를 가져와 그대로 렌더링
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>NodeBird</title>
            </Head>
            <Component />
        </>
    )
}

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(NodeBird);