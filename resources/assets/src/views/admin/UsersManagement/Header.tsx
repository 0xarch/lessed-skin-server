import styled from '@emotion/styled'
import { lessThan, Breakpoint } from '@/styles/breakpoints'

const Header = styled.div`
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
