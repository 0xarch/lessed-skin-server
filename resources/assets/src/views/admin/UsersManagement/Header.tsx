import { lessThan, Breakpoint } from '@/styles/breakpoints'
import { css } from '@emotion/react'

const Header = css`
  display: flex !important;
  & > div {
    margin-left: auto;
  }

  ${lessThan(Breakpoint.sm)} {
    flex-wrap: wrap;
    & > div {
      margin: 7px 0 0 0;
    }
  }
`

export default Header
