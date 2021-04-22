import { createGlobalStyle } from 'styled-components'
import palette from './palette'

const GlobalStyle = createGlobalStyle`
    *:not([type=checkbox]) {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        transition: all 0.4s cubic-bezier(.5, 1.8, .5, .8);
    }
    body {
        font-family: Noto Sans, Noto Sans KR;
        color: ${palette.black};
    }
    a {
        color: inherit;
        text-decoration: none;
    }
`

export default GlobalStyle