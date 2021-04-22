import Link from 'next/link'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import palette from '../styles/palette'
import Setting from '../utils/setting'

const Container = styled.div`
    color: ${palette.gray};
`

const index: React.FC = () => {
    return (
        <>
            <Head>
                <title>HOME : {Setting.title}</title>
                <meta property="og:title" key="title" content={Setting.title} />
            </Head>
            <Container>
            </Container>
        </>
    )
}

export default index
